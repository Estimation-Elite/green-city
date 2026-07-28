// Rattrapage Airtable : cree les lignes manquantes a partir d'un export CSV
// Brevo de la liste "Tous leads". Sert quand le scenario Make "Brevo vers
// Airtable" a saute des contacts (fenetre modifiedSince trop courte, tour en
// erreur) : ces leads ne repassent jamais, le scenario ne regarde que les
// dernieres heures.
//
// Standalone (node >= 18, aucune dependance), comme backfill-greencity.mjs.
// Replique exactement les mappings du blueprint Make, mais depuis les
// libelles du CSV (l'export donne "3_6M" la ou l'API donne "2").
//
// Usage :
//   node scripts/backfill-airtable.mjs <export-brevo.csv>          # dry-run
//   node scripts/backfill-airtable.mjs <export-brevo.csv> --send   # envoi reel
//   --skip=a@b.com,c@d.com   laisse ces contacts au scenario Make (evite un
//                            doublon sur un lead assez recent pour etre encore
//                            dans sa fenetre modifiedSince)
//   --csv=<fichier>          n'ecrit rien via l'API : produit un CSV a importer
//                            a la main dans Airtable (utile si le token n'a pas
//                            le scope data.records:write)
//
// Env requis : AIRTABLE_TOKEN (cf. .env a la racine du monorepo).

import { readFile, writeFile } from "node:fs/promises";

const BASE_ID = process.env.AIRTABLE_BASE_ID ?? "appqvsMS9Lpc8K49t";
const TABLE_ID = process.env.AIRTABLE_TABLE_ID ?? "tblv13HSxx0jEvOUC";
const token = process.env.AIRTABLE_TOKEN;

// Champs cibles, references par id : les noms Airtable sont accentues et
// peuvent etre renommes, les ids non.
const FIELD = {
  firstName: "fldGKOGFwFYeuvxbz",
  lastName: "fldW6pdiVUfvYzlRs",
  phone: "fldLwTdjC3FSfhHwl",
  email: "fldgQbGTYGkzquX3p",
  temperature: "fld513M06lH8Z1tBC",
  source: "fldOMgXHrP2QRP7Qw",
  programme: "fld3YtJ7WHpIl6Uab",
  rdv: "fldsWmVhJdEc0qd19",
  rdvPris: "fld1qJ0XmDzdgKE3l",
  objectif: "fldlTf053BOooB7Na",
  horizon: "fldEn6zmlw6I9EOXp",
  financement: "fldbilxuMUCKdqiTz",
  message: "fldQwEE8xwDejyHQr",
};

const SOURCE_MAP = {
  ARCHIPEL_LP: "Archipel",
  REVELATION_LP: "Révélation",
  HOME_SPIRIT2_LP: "Home Spirit 2",
  FB_ADS: "FB ADS",
};
const PROGRAMME_MAP = {
  ARCHIPEL: "Archipel",
  REVELATION: "Révélation",
  HOME_SPIRIT2: "Home Spirit 2",
};
const HORIZON_MAP = {
  "0_3M": "0-3 mois",
  "3_6M": "3-6 mois",
  "6_12M": "6-12 mois",
  "12M_PLUS": "12 mois et plus",
  NON_DEFINI: "Non défini",
};
const OBJECTIF_MAP = { HABITER: "Résidence principale", INVESTIR: "Investissement" };
const FINANCEMENT_MAP = { OUI: "Validé", NON: "Non", EN_COURS: "En cours" };

if (!token) {
  console.error("AIRTABLE_TOKEN manquant.");
  process.exit(2);
}

const args = process.argv.slice(2);
const send = args.includes("--send");
const inputPath = args.find((a) => !a.startsWith("--"));
const skip = new Set(
  (args.find((a) => a.startsWith("--skip="))?.slice("--skip=".length) ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);
if (!inputPath) {
  console.error("Usage: node scripts/backfill-airtable.mjs <export-brevo.csv> [--send]");
  process.exit(2);
}

// Parseur CSV minimal (guillemets + separateur configurable) : le champ MESSAGE
// est saisi par le prospect et peut contenir le separateur ou des retours ligne.
function parseCsv(text, delimiter = ";") {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === delimiter) { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.some((v) => v !== ""));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

async function airtable(path, init = {}) {
  const res = await fetch(`https://api.airtable.com/v0/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`Airtable ${res.status} ${await res.text().catch(() => "")}`);
  return res.json();
}

async function fetchExistingEmails() {
  const emails = new Set();
  let offset;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const page = await airtable(`${BASE_ID}/${TABLE_ID}?${params}`);
    for (const rec of page.records) {
      const email = (rec.fields.Email ?? "").trim().toLowerCase();
      if (email) emails.add(email);
    }
    offset = page.offset;
  } while (offset);
  return emails;
}

// "29-07-2026" + "10:00" -> "2026-07-29T10:00:00", comme le if() du blueprint.
function toIsoDateTime(date, time) {
  if (!date) return undefined;
  const [d, m, y] = date.split("-");
  if (!y) return undefined;
  return `${y}-${m}-${d}T${time || "00:00"}:00`;
}

function buildFields(contact) {
  const fields = {
    [FIELD.email]: contact.EMAIL,
    [FIELD.firstName]: contact.FIRSTNAME,
    [FIELD.lastName]: contact.LASTNAME,
    [FIELD.phone]: contact.SMS,
    [FIELD.temperature]: contact.TEMPERATURE,
    [FIELD.source]: SOURCE_MAP[contact.SOURCE_LP],
    [FIELD.programme]: PROGRAMME_MAP[contact.PROGRAMME],
    [FIELD.objectif]: OBJECTIF_MAP[contact.OBJECTIF],
    [FIELD.horizon]: HORIZON_MAP[contact.HORIZON_ACHAT],
    [FIELD.financement]: FINANCEMENT_MAP[contact.FINANCEMENT],
    [FIELD.message]: contact.MESSAGE,
    [FIELD.rdvPris]: contact.RDV_PRIS,
    [FIELD.rdv]: toIsoDateTime(contact.RDV_DATE, contact.RDV_TIME),
  };
  for (const key of Object.keys(fields)) {
    if (fields[key] === undefined || fields[key] === "") delete fields[key];
  }
  return fields;
}

const contacts = parseCsv(await readFile(inputPath, "utf8"));
const existing = await fetchExistingEmails();
const missing = contacts.filter(
  (c) =>
    c.EMAIL &&
    !existing.has(c.EMAIL.trim().toLowerCase()) &&
    !skip.has(c.EMAIL.trim().toLowerCase()),
);

console.log(JSON.stringify({
  event: "backfill.start",
  mode: send ? "SEND" : "DRY-RUN",
  contactsCsv: contacts.length,
  lignesAirtable: existing.size,
  ignores: [...skip],
  aCreer: missing.length,
}));

// Sortie CSV : entetes = noms des colonnes Airtable, pour que l'assistant
// d'import les reconnaisse tout seul.
const csvPath = args.find((a) => a.startsWith("--csv="))?.slice("--csv=".length);
if (csvPath) {
  const columns = [
    ["Email", FIELD.email],
    ["Prénom", FIELD.firstName],
    ["Nom", FIELD.lastName],
    ["Téléphone", FIELD.phone],
    ["Température", FIELD.temperature],
    ["Source", FIELD.source],
    ["Programme", FIELD.programme],
    ["Objectif", FIELD.objectif],
    ["Horizon d'achat", FIELD.horizon],
    ["Financement", FIELD.financement],
    ["Commentaire", FIELD.message],
    ["RDV Date", FIELD.rdv],
  ];
  const escape = (v) => (/[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v);
  const lines = [columns.map(([name]) => escape(name)).join(",")];
  for (const contact of missing) {
    const fields = buildFields(contact);
    lines.push(columns.map(([, id]) => escape(fields[id] ?? "")).join(","));
  }
  await writeFile(csvPath, `${lines.join("\n")}\n`, "utf8");
  console.log(JSON.stringify({ event: "backfill.csv", path: csvPath, lignes: missing.length }));
  process.exit(0);
}

let ok = 0;
let fail = 0;
// L'API Airtable accepte 10 records par requete, 5 req/s par base.
for (let i = 0; i < missing.length; i += 10) {
  const batch = missing.slice(i, i + 10);
  const records = batch.map((c) => ({ fields: buildFields(c) }));
  if (!send) {
    for (const [j, r] of records.entries()) {
      console.log(JSON.stringify({ event: "backfill.dry_run", email: batch[j].EMAIL, fields: r.fields }));
    }
    ok += records.length;
    continue;
  }
  try {
    const created = await airtable(`${BASE_ID}/${TABLE_ID}`, {
      method: "POST",
      body: JSON.stringify({ records, typecast: true }),
    });
    for (const rec of created.records) {
      ok++;
      console.log(JSON.stringify({ event: "backfill.created", recordId: rec.id, email: rec.fields.Email }));
    }
  } catch (err) {
    fail += batch.length;
    console.error(JSON.stringify({
      event: "backfill.failed",
      emails: batch.map((c) => c.EMAIL),
      error: err instanceof Error ? err.message : String(err),
    }));
  }
  await new Promise((r) => setTimeout(r, 300));
}

console.log(JSON.stringify({ event: "backfill.done", mode: send ? "SEND" : "DRY-RUN", ok, fail }));
process.exit(fail > 0 ? 1 : 0);
