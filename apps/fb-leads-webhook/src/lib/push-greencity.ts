import {
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

  const residences = await resolveResidenceIds();
  if (residences.length === 0) {
    logError("fb.lead.no_residences", { source, email: lead.email });
  }

  const temperature = computeTemperature("lead", {
    objectif: lead.objectif,
    purchaseTime: lead.horizonAchat,
    financingValidation: lead.financement,
  });

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
