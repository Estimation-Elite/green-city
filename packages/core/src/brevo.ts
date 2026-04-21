// Brevo API integration — minimal client for nurturing list contact upsert.
// Used by leadHandler to push COLD leads into a Brevo list that triggers an
// email automation workflow.

const BREVO_API_BASE = "https://api.brevo.com/v3";

// Brevo's SMS attribute requires E.164 (international) format. We normalize
// French numbers (10 digits starting with 0) to +33XXXXXXXXX. Anything else
// is dropped to avoid a 400 from Brevo that would prevent contact creation.
function normalizePhoneE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("33") && digits.length === 11) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+33${digits.slice(1)}`;
  if (phone.startsWith("+") && digits.length >= 8) return `+${digits}`;
  return null;
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
  listId: number,
  apiKey: string,
): Promise<AddContactToListResult> {
  const normalizedPhone = contact.phone ? normalizePhoneE164(contact.phone) : null;
  const attributes: Record<string, unknown> = {
    ...(contact.firstName ? { FIRSTNAME: contact.firstName } : {}),
    ...(contact.lastName ? { LASTNAME: contact.lastName } : {}),
    ...(normalizedPhone ? { SMS: normalizedPhone } : {}),
    ...contact.attributes,
  };

  const res = await fetch(`${BREVO_API_BASE}/contacts`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: contact.email,
      attributes,
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  const body = await res.json().catch(() => undefined);

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

  const res = await fetch(`${BREVO_API_BASE}/contacts/${identifier}`, {
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
    console.error(`[BREVO] PUT /contacts/${email} failed (${res.status}): ${body}`);
    return { updated: false, status: res.status };
  }

  return { updated: true, status: res.status };
}
