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

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// Matching tolérant par mots-clés : les libellés FB sont souvent des phrases
// (« Investir dans l'immobilier locatif », « Pas encore mais bientôt »…) qui ne
// correspondent à aucune clé d'une table exacte. On classe donc sur des
// mots-clés appliqués à la valeur normalisée (accents retirés, minuscules).
// Toute réponse non reconnue retombe sur undefined (et est logguée côté route).
function classifyObjectif(value?: string): NormalizedLead["objectif"] {
  if (!value) return undefined;
  const v = normalize(value);
  if (
    /invest|locatif|louer|rentab|defisc|pinel/.test(v)
  ) {
    return "INVESTIR";
  }
  if (/habit|principal|residence|vivre|primo|loger/.test(v)) {
    return "HABITER";
  }
  return undefined;
}

function classifyHorizon(value?: string): NormalizedLead["horizonAchat"] {
  if (!value) return undefined;
  const v = normalize(value);
  if (/immediat|tout de suite|des que|rapide|asap|now|3 mois|0-3/.test(v)) {
    return "IMMEDIAT";
  }
  if (/6 mois|6mois|semestre|1 an|un an|12 mois|cette annee/.test(v)) {
    return "6_MOIS";
  }
  if (
    /pas|indefini|sais pas|informe|renseign|plus tard|long terme|reflexion/.test(
      v,
    )
  ) {
    return "INDEFINI";
  }
  return undefined;
}

function classifyFinancement(value?: string): NormalizedLead["financement"] {
  if (!value) return undefined;
  const v = normalize(value);
  // EN_COURS d'abord : « en cours de validation » contient aussi « validation ».
  if (/cours|attente|demande|etude/.test(v)) return "EN_COURS";
  // Ne pas matcher « valid » : présent dans l'intitulé de la question
  // (« avez-vous validé… »), pas dans la réponse.
  if (/oui|yes|accord|obtenu/.test(v)) return "OUI";
  if (/non|\bno\b|pas encore|aucun/.test(v)) return "NON";
  return undefined;
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

  result.objectif = classifyObjectif(input.objectif);
  result.horizonAchat = classifyHorizon(input.horizon_achat);
  result.financement = classifyFinancement(input.financement);

  return result;
}
