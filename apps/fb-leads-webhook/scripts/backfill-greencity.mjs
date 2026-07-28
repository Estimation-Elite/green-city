// Rattrapage GreenCity : envoie au CRM des leads Facebook jamais transmis
// (coupure du scénario Make). Standalone (node >= 18, aucune dépendance) pour
// pouvoir tourner hors du build Next. Réplique les mappings de @repo/core
// (mapObjective / mapPurchaseTime / mapFinancingValidation) et le format de
// commentaire du webhook ("[source] message").
//
// Usage :
//   node scripts/backfill-greencity.mjs <input.json>          # dry-run (aucun POST)
//   node scripts/backfill-greencity.mjs <input.json> --send   # envoi réel
//
// Env requis (cf. apps/fb-leads-webhook/.env) : GREENCITY_API_URL,
// GREENCITY_API_KEY, GREENCITY_API_SECRET, GREENCITY_RESIDENCE_NAMES.
//
// Input : tableau de { email, firstName, lastName, phone (E.164),
// objectif?: HABITER|INVESTIR, horizon?: IMMEDIAT|6_MOIS|INDEFINI,
// financement?: OUI|NON|EN_COURS, temperature: HOT|LUKEWARM|COLD, dateFb }.
// La température est fournie (pas recalculée) : pour les leads d'avril-mai les
// réponses FB n'ont pas été conservées, seule la température Brevo l'a été.

import { readFile } from "node:fs/promises";

const OBJECTIVE_MAP = { HABITER: "PRINCIPAL_RESIDENCE", INVESTIR: "INVEST" };
const PURCHASE_TIME_MAP = { IMMEDIAT: "NOW", "6_MOIS": "6_MONTHS" };
const FINANCING_MAP = { OUI: "YES", NON: "NO", EN_COURS: "IN_PROGRESS" };

const baseUrl = (process.env.GREENCITY_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");
const apiKey = process.env.GREENCITY_API_KEY;
const apiSecret = process.env.GREENCITY_API_SECRET;
const residenceNames = (process.env.GREENCITY_RESIDENCE_NAMES ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (!baseUrl || !apiKey || !apiSecret) {
  console.error("GREENCITY_API_URL / GREENCITY_API_KEY / GREENCITY_API_SECRET manquants.");
  process.exit(2);
}

const args = process.argv.slice(2);
const send = args.includes("--send");
const inputPath = args.find((a) => !a.startsWith("--"));
if (!inputPath) {
  console.error("Usage: node scripts/backfill-greencity.mjs <input.json> [--send]");
  process.exit(2);
}

async function login() {
  const res = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, api_secret: apiSecret }),
  });
  if (!res.ok) throw new Error(`GreenCity auth failed (${res.status})`);
  return (await res.json()).token;
}

function normalizeResidenceName(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function resolveResidences(token) {
  const res = await fetch(`${baseUrl}/api/lead/residences`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`residences fetch failed (${res.status})`);
  const residences = await res.json();
  const ids = [];
  for (const name of residenceNames) {
    const target = normalizeResidenceName(name);
    const match = residences.find((r) => normalizeResidenceName(r.name) === target);
    if (match) ids.push(match.id);
    else console.error(JSON.stringify({ event: "backfill.residence.unresolved", name }));
  }
  return ids;
}

function buildPayload(lead, residences) {
  // Résidence(s) : préfère l'assignation par lead (mappée sur sa vraie source
  // LP) si fournie, sinon retombe sur celles résolues depuis l'env.
  const leadResidences =
    Array.isArray(lead.residences) && lead.residences.length > 0
      ? lead.residences
      : residences;
  const payload = {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phoneMobile: lead.phone,
    objective: OBJECTIVE_MAP[lead.objectif],
    purchaseTime: PURCHASE_TIME_MAP[lead.horizon],
    financingValidation: FINANCING_MAP[lead.financement],
    comment: `[Rattrapage lead du ${lead.dateFb}]`,
    residences: leadResidences.length > 0 ? leadResidences : undefined,
    temperature: lead.temperature,
  };
  for (const key of Object.keys(payload)) {
    if (payload[key] === undefined) delete payload[key];
  }
  return payload;
}

const leads = JSON.parse(await readFile(inputPath, "utf8"));
const token = await login();
const residences = await resolveResidences(token);
console.log(JSON.stringify({ event: "backfill.start", mode: send ? "SEND" : "DRY-RUN", count: leads.length, residences }));

let ok = 0;
let fail = 0;
for (const lead of leads) {
  const payload = buildPayload(lead, residences);
  if (!send) {
    console.log(JSON.stringify({ event: "backfill.dry_run", payload }));
    ok++;
    continue;
  }
  try {
    const res = await fetch(`${baseUrl}/api/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      fail++;
      console.error(JSON.stringify({ event: "backfill.failed", email: lead.email, status: res.status, body: await res.text().catch(() => "") }));
    } else {
      const created = await res.json();
      ok++;
      console.log(JSON.stringify({ event: "backfill.created", email: lead.email, temperature: lead.temperature, greenCityLeadId: created.id }));
    }
  } catch (err) {
    fail++;
    console.error(JSON.stringify({ event: "backfill.threw", email: lead.email, error: err instanceof Error ? err.message : String(err) }));
  }
  await new Promise((r) => setTimeout(r, 300));
}
console.log(JSON.stringify({ event: "backfill.done", mode: send ? "SEND" : "DRY-RUN", ok, fail }));
process.exit(fail > 0 ? 1 : 0);
