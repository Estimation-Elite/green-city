import {
  addContactToBrevoList,
  computeTemperature,
  createGreenCityLead,
  findGreenCityResidenceIdByName,
  mapFinancingValidation,
  mapObjective,
  mapPurchaseTime,
  normalizePhoneE164,
  type GreenCityLeadPayload,
} from "@repo/core";
import type { NormalizedLead } from "./field-mapping";

export type PushResult =
  | { ok: true; leadId: string; temperature: string }
  | { ok: false; status: number; error: string };

function logEvent(event: string, extra: Record<string, unknown>) {
  console.log(JSON.stringify({ event, ...extra }));
}

function logError(event: string, extra: Record<string, unknown>) {
  console.error(JSON.stringify({ event, ...extra }));
}

async function resolveResidenceIds(): Promise<number[]> {
  const raw = process.env.GREENCITY_RESIDENCE_NAMES;
  if (!raw) return [];

  const names = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const resolved = await Promise.all(
    names.map(async (name) => {
      try {
        const id = await findGreenCityResidenceIdByName(name);
        if (id === undefined) {
          logError("fb.residence.unresolved", { name });
        }
        return id;
      } catch (err) {
        logError("fb.residence.lookup_failed", {
          name,
          error: err instanceof Error ? err.message : String(err),
        });
        return undefined;
      }
    }),
  );

  return resolved.filter((id): id is number => typeof id === "number");
}

export async function pushLeadToGreenCity(
  lead: NormalizedLead,
  source: string,
): Promise<PushResult> {
  if (!lead.email) {
    return { ok: false, status: 400, error: "email manquant" };
  }
  if (!lead.phone) {
    return { ok: false, status: 400, error: "telephone manquant" };
  }

  const phoneMobile = normalizePhoneE164(lead.phone);
  if (!phoneMobile) {
    return {
      ok: false,
      status: 400,
      error:
        "Le numero de telephone est invalide. Format attendu : 06 12 34 56 78 ou +33 6 12 34 56 78.",
    };
  }

  const lastName = lead.lastName || lead.firstName || "Lead Facebook";
  const firstName = lead.firstName || lastName;

  const temperature = computeTemperature("lead", {
    objectif: lead.objectif,
    purchaseTime: lead.horizonAchat,
    financingValidation: lead.financement,
  });

  // Every FB lead lands in Brevo "Tous leads" (fire-and-forget), regardless
  // of temperature or GreenCity outcome.
  upsertToAllLeadsList({
    email: lead.email,
    firstName,
    lastName,
    phone: phoneMobile,
    temperature,
    source,
  });

  // COLD stops here: no GreenCity write, no residence resolution. The
  // SOURCE_LP attribute on the Brevo contact is enough for FB-specific
  // segmentation.
  if (temperature === "COLD") {
    logEvent("fb.lead.cold_processed", {
      source,
      email: lead.email,
    });
    return { ok: true, leadId: lead.email, temperature };
  }

  const residences = await resolveResidenceIds();
  if (residences.length === 0) {
    logError("fb.lead.no_residences", { source, email: lead.email });
  }

  const commentParts = [`[${source}]`];
  if (lead.message) commentParts.push(lead.message);

  const payload: GreenCityLeadPayload = {
    firstName,
    lastName,
    email: lead.email,
    phoneMobile,
    objective: mapObjective(lead.objectif),
    purchaseTime: mapPurchaseTime(lead.horizonAchat),
    financingValidation: mapFinancingValidation(lead.financement),
    comment: commentParts.join(" "),
    residences: residences.length > 0 ? residences : undefined,
    temperature,
  };

  // Dev/test toggle: skip the GreenCity API call entirely. Brevo is still
  // exercised. Set DRY_RUN_GREENCITY=true in the env to enable.
  if (process.env.DRY_RUN_GREENCITY === "true") {
    logEvent("fb.lead.dry_run", {
      source,
      email: lead.email,
      temperature,
      payload,
    });
    return { ok: true, leadId: `dry-run-${lead.email}`, temperature };
  }

  try {
    const result = await createGreenCityLead(payload);
    logEvent("fb.lead.created", {
      source,
      email: lead.email,
      temperature,
      greenCityLeadId: result.id,
    });

    return { ok: true, leadId: String(result.id), temperature };
  } catch (err) {
    logError("fb.lead.failed", {
      source,
      email: lead.email,
      error: err instanceof Error ? err.message : String(err),
    });
    return {
      ok: false,
      status: 502,
      error: "Echec de la creation du lead cote GreenCity.",
    };
  }
}

// SOURCE_LP is a Brevo category (enum) attribute. Value 4 = FB_ADS,
// declared in the Brevo schema alongside the LP-specific values
// (1=ARCHIPEL_LP, 2=REVELATION_LP, 3=HOME_SPIRIT2_LP). Brevo silently
// drops string values that are not enum members, so we MUST send the
// integer ID, not the label.
const SOURCE_LP_FB_ADS = 4;

// Fire-and-forget upsert into the Brevo "Tous leads" registry list with
// TEMPERATURE and SOURCE_LP. SOURCE_LP is set to FB_ADS (4) so Brevo
// workflows can segment FB-origin contacts (e.g. FB-specific nurturing
// for COLD) without a dedicated list. LP-origin contacts do not set
// SOURCE_LP today, which is how the two origins are distinguished.
function upsertToAllLeadsList(params: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  temperature: string;
  source: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_ALL_LEADS_LIST_ID;
  const listId = listIdRaw ? Number(listIdRaw) : NaN;

  if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
    logError("fb.brevo.config_missing", {
      hasApiKey: Boolean(apiKey),
      hasListId: Boolean(listIdRaw),
    });
    return;
  }

  void addContactToBrevoList(
    {
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      attributes: {
        TEMPERATURE: params.temperature,
        SOURCE_LP: SOURCE_LP_FB_ADS,
      },
    },
    listId,
    apiKey,
  )
    .then((result) => {
      if (!result.ok) {
        logError("fb.brevo.upsert.failed", {
          source: params.source,
          email: params.email,
          listId,
          status: result.status,
          body: result.body,
        });
      }
    })
    .catch((err) => {
      logError("fb.brevo.upsert.threw", {
        source: params.source,
        email: params.email,
        listId,
        error: err instanceof Error ? err.message : String(err),
      });
    });
}
