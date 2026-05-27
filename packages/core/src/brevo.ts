// Brevo API integration — minimal client for nurturing list contact upsert.
// Used by leadHandler to push COLD leads into a Brevo list that triggers an
// email automation workflow.

import { normalizePhoneE164 } from "./phone";

const BREVO_API_BASE = "https://api.brevo.com/v3";
const RETRY_DELAYS_MS = [200, 600]; // 2 retries with exponential-ish backoff

// Retry on transient failures only: 5xx (Brevo down) and 429 (rate limit).
// 4xx errors are permanent (bad payload, bad key) — retrying would only delay
// the inevitable and waste quota.
async function fetchWithRetry(
  url: string,
  init: RequestInit,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch(url, init);
      const transient = res.status === 429 || res.status >= 500;
      if (!transient || attempt === RETRY_DELAYS_MS.length) return res;
      await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
    } catch (err) {
      lastError = err;
      if (attempt === RETRY_DELAYS_MS.length) throw err;
      await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
    }
  }
  throw lastError ?? new Error("fetchWithRetry: exhausted retries");
}

export interface BrevoContactPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  attributes?: Record<string, unknown>;
}

export interface AddContactToListResult {
  ok: boolean;
  status: number;
  body?: unknown;
}

export async function addContactToBrevoList(
  contact: BrevoContactPayload,
  listIds: number | number[],
  apiKey: string,
): Promise<AddContactToListResult> {
  const normalizedPhone = contact.phone ? normalizePhoneE164(contact.phone) : null;
  const attributes: Record<string, unknown> = {
    ...(contact.firstName ? { FIRSTNAME: contact.firstName } : {}),
    ...(contact.lastName ? { LASTNAME: contact.lastName } : {}),
    ...(normalizedPhone ? { SMS: normalizedPhone } : {}),
    ...contact.attributes,
  };

  const ids = Array.isArray(listIds) ? listIds : [listIds];

  const res = await fetchWithRetry(`${BREVO_API_BASE}/contacts`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: contact.email,
      attributes,
      listIds: ids,
      updateEnabled: true,
      // Sans ce flag, Brevo refuse l'upsert (400 duplicate_parameter) quand
      // un identifiant unique (SMS surtout, parfois email) est deja attache
      // a un autre contact. forceMerge: true fusionne les deux contacts en
      // gardant celui au last_modified le plus recent, ce qui evite que des
      // leads (notamment FB COLD) disparaissent de "Tous leads".
      forceMerge: true,
    }),
  });

  // Read as text first (never throws), then attempt JSON. Preserves the raw
  // response when Brevo returns non-JSON (HTML from an upstream proxy, empty
  // body on 201, etc.) — otherwise we'd log `body: undefined` and lose the
  // diagnostic content.
  const rawBody = await res.text().catch(() => "");
  let body: unknown = rawBody || undefined;
  try {
    if (rawBody) body = JSON.parse(rawBody);
  } catch {
    // keep rawBody as-is
  }

  return { ok: res.ok, status: res.status, body };
}

export interface MarkContactResult {
  updated: boolean;
  status: number;
}

// Set the RDV_PRIS boolean attribute on an existing Brevo contact. Used by
// rdvHandler to trigger the workflow exit condition. Never creates a contact:
// a 404 (unknown email) is a normal, silent outcome.
export async function markContactAsRdvPris(
  email: string,
  apiKey: string,
): Promise<MarkContactResult> {
  const identifier = encodeURIComponent(email.trim().toLowerCase());

  const res = await fetchWithRetry(`${BREVO_API_BASE}/contacts/${identifier}`, {
    method: "PUT",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ attributes: { RDV_PRIS: true } }),
  });

  if (res.status === 404) {
    return { updated: false, status: 404 };
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    // TODO(Sentry): Sentry.captureMessage("brevo.rdv.update.failed", { level: "error", extra: { email, status: res.status, body } })
    console.error(
      JSON.stringify({
        event: "brevo.rdv.update.failed",
        email,
        status: res.status,
        body,
      }),
    );
    return { updated: false, status: res.status };
  }

  return { updated: true, status: res.status };
}

export interface SendTransacEmailPayload {
  to: Array<{ email: string; name?: string }>;
  templateId: number;
  params?: Record<string, string | number | boolean>;
}

export interface SendTransacEmailResult {
  ok: boolean;
  status: number;
  messageId?: string;
}

// Send a transactional email via a Brevo template. Never throws: callers
// typically fire-and-forget after the primary action (RDV / lead creation)
// has already succeeded, so a Brevo outage must not surface as a 500.
export async function sendBrevoTransactionalEmail(
  payload: SendTransacEmailPayload,
  apiKey: string,
): Promise<SendTransacEmailResult> {
  try {
    const res = await fetchWithRetry(`${BREVO_API_BASE}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      // TODO(Sentry): Sentry.captureMessage("brevo.transac.failed", { level: "error", extra: { templateId: payload.templateId, status: res.status, body } })
      console.error(
        JSON.stringify({
          event: "brevo.transac.failed",
          templateId: payload.templateId,
          to: payload.to.map((t) => t.email),
          status: res.status,
          body,
        }),
      );
      return { ok: false, status: res.status };
    }

    const data = (await res.json().catch(() => ({}))) as { messageId?: string };
    return { ok: true, status: res.status, messageId: data.messageId };
  } catch (err) {
    // TODO(Sentry): Sentry.captureException(err, { extra: { templateId: payload.templateId, phase: "brevo.transac.send" } })
    console.error(
      JSON.stringify({
        event: "brevo.transac.threw",
        templateId: payload.templateId,
        to: payload.to.map((t) => t.email),
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return { ok: false, status: 0 };
  }
}
