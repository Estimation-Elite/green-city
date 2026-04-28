export interface InboundLead {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  objectif?: string;
  horizon_achat?: string;
  financement?: string;
  message?: string;
}

export interface NormalizedLead {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  objectif?: "HABITER" | "INVESTIR";
  horizonAchat?: "IMMEDIAT" | "6_MOIS" | "INDEFINI";
  financement?: "OUI" | "NON" | "EN_COURS";
  message?: string;
}

const OBJECTIF_MAP: Record<string, NormalizedLead["objectif"]> = {
  habiter: "HABITER",
  "residence principale": "HABITER",
  habiter_principal: "HABITER",
  investir: "INVESTIR",
  investissement: "INVESTIR",
  invest: "INVESTIR",
};

const HORIZON_MAP: Record<string, NormalizedLead["horizonAchat"]> = {
  immediat: "IMMEDIAT",
  immediate: "IMMEDIAT",
  "des que possible": "IMMEDIAT",
  now: "IMMEDIAT",
  "sous 6 mois": "6_MOIS",
  "6 mois": "6_MOIS",
  "dans 6 mois": "6_MOIS",
  "6_mois": "6_MOIS",
  "pas defini": "INDEFINI",
  indefini: "INDEFINI",
  "ne sait pas": "INDEFINI",
};

const FINANCEMENT_MAP: Record<string, NormalizedLead["financement"]> = {
  oui: "OUI",
  yes: "OUI",
  non: "NON",
  no: "NON",
  "en cours": "EN_COURS",
  en_cours: "EN_COURS",
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function pick<T>(map: Record<string, T>, value?: string): T | undefined {
  if (!value) return undefined;
  return map[normalize(value)];
}

function splitFullName(full: string): { firstName?: string; lastName?: string } {
  const trimmed = full.trim();
  if (!trimmed) return {};
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function normalizeInboundLead(input: InboundLead): NormalizedLead {
  const result: NormalizedLead = {};

  result.email = input.email?.trim() || undefined;
  result.phone = input.phone?.trim() || undefined;
  result.message = input.message?.trim() || undefined;

  if (input.firstName?.trim()) result.firstName = input.firstName.trim();
  if (input.lastName?.trim()) result.lastName = input.lastName.trim();

  if (!result.firstName && !result.lastName && input.fullName?.trim()) {
    const split = splitFullName(input.fullName);
    result.firstName = split.firstName;
    result.lastName = split.lastName;
  }

  result.objectif = pick(OBJECTIF_MAP, input.objectif);
  result.horizonAchat = pick(HORIZON_MAP, input.horizon_achat);
  result.financement = pick(FINANCEMENT_MAP, input.financement);

  return result;
}
