import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  addContactToBrevoList,
  computeTemperature,
  normalizePhoneE164,
} from "@repo/core";

// SOURCE_LP=4 = FB_ADS. Identique au webhook (cf. push-greencity.ts).
const SOURCE_LP_FB_ADS = 4;

interface FbField {
  name: string;
  values: string[];
}

interface FbLead {
  id: string;
  created_time: string;
  field_data: FbField[];
  ad_id?: string;
  form_id?: string;
}

interface FbExport {
  data: FbLead[];
}

type Objectif = "HABITER" | "INVESTIR";
type Horizon = "IMMEDIAT" | "6_MOIS" | "INDEFINI";
type Financement = "OUI" | "NON" | "EN_COURS";

const OBJECTIF_MAP: Record<string, Objectif> = {
  habiter: "HABITER",
  investir: "INVESTIR",
};

const HORIZON_MAP: Record<string, Horizon> = {
  immediat: "IMMEDIAT",
  dans_les_6_prochains_mois: "6_MOIS",
  pas_de_date_definie: "INDEFINI",
};

const FINANCEMENT_MAP: Record<string, Financement> = {
  oui: "OUI",
  non: "NON",
  en_cours: "EN_COURS",
};

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function normalizeKey(value: string | undefined): string {
  if (!value) return "";
  return stripAccents(value).trim().toLowerCase();
}

function getField(map: Map<string, string>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = map.get(key);
    if (value) return value;
  }
  return undefined;
}

function splitFullName(full: string): { firstName?: string; lastName?: string } {
  const trimmed = full.trim();
  if (!trimmed) return {};
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function logEvent(event: string, extra: Record<string, unknown>) {
  console.log(JSON.stringify({ event, ...extra }));
}

function buildFieldMap(lead: FbLead): Map<string, string> {
  const map = new Map<string, string>();
  for (const field of lead.field_data) {
    const key = normalizeKey(field.name);
    const value = field.values?.[0]?.trim();
    if (value) map.set(key, value);
  }
  return map;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const filePath = args.find((a) => !a.startsWith("--"));

  if (!filePath) {
    console.error("Usage: tsx scripts/backfill-brevo.ts <path-to-fb-export.json> [--dry-run]");
    process.exit(2);
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_ALL_LEADS_LIST_ID;
  const listId = listIdRaw ? Number(listIdRaw) : NaN;

  if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
    console.error("Missing BREVO_API_KEY or BREVO_ALL_LEADS_LIST_ID in env.");
    process.exit(2);
  }

  const absolute = resolve(process.cwd(), filePath);
  const raw = await readFile(absolute, "utf8");
  const parsed = JSON.parse(raw) as FbExport;
  const leads = parsed.data ?? [];

  let okCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const lead of leads) {
    const fields = buildFieldMap(lead);

    const email = getField(fields, "e-mail", "email")?.toLowerCase();
    const phoneRaw = getField(fields, "numero_de_telephone", "phone");
    const nameRaw = getField(fields, "nom_complet", "full_name") ?? "";
    const objectifRaw = normalizeKey(getField(fields, "quel_est_votre_objectif_?"));
    const horizonRaw = normalizeKey(getField(fields, "quel_est_votre_horizon_d'achat_?"));
    const financementRaw = normalizeKey(
      getField(fields, "avez-vous_deja_valide_un_financement_?"),
    );

    if (!email) {
      logEvent("backfill.skipped", { id: lead.id, reason: "no_email" });
      skipCount++;
      continue;
    }

    const phone = phoneRaw ? normalizePhoneE164(phoneRaw) : undefined;
    if (!phone) {
      logEvent("backfill.skipped", { id: lead.id, email, reason: "invalid_phone", phoneRaw });
      skipCount++;
      continue;
    }

    const { firstName: fn, lastName: ln } = splitFullName(nameRaw);
    const lastName = ln || fn || "Lead Facebook";
    const firstName = fn || lastName;

    const objectif = OBJECTIF_MAP[objectifRaw];
    const horizonAchat = HORIZON_MAP[horizonRaw];
    const financement = FINANCEMENT_MAP[financementRaw];

    if (objectifRaw && !objectif) {
      logEvent("backfill.unknown_value", { id: lead.id, field: "objectif", value: objectifRaw });
    }
    if (horizonRaw && !horizonAchat) {
      logEvent("backfill.unknown_value", { id: lead.id, field: "horizon", value: horizonRaw });
    }
    if (financementRaw && !financement) {
      logEvent("backfill.unknown_value", {
        id: lead.id,
        field: "financement",
        value: financementRaw,
      });
    }

    const temperature = computeTemperature("lead", {
      objectif,
      purchaseTime: horizonAchat,
      financingValidation: financement,
    });

    if (dryRun) {
      logEvent("backfill.dry_run", {
        id: lead.id,
        email,
        firstName,
        lastName,
        phone,
        temperature,
        objectif,
        horizonAchat,
        financement,
      });
      okCount++;
      continue;
    }

    const result = await addContactToBrevoList(
      {
        email,
        firstName,
        lastName,
        phone,
        attributes: {
          TEMPERATURE: temperature,
          SOURCE_LP: SOURCE_LP_FB_ADS,
        },
      },
      listId,
      apiKey,
    );

    if (result.ok) {
      logEvent("backfill.brevo.ok", { id: lead.id, email, temperature, status: result.status });
      okCount++;
    } else {
      logEvent("backfill.brevo.failed", {
        id: lead.id,
        email,
        temperature,
        status: result.status,
        body: result.body,
      });
      failCount++;
    }
  }

  logEvent("backfill.summary", {
    file: absolute,
    dryRun,
    total: leads.length,
    ok: okCount,
    skipped: skipCount,
    failed: failCount,
  });

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : String(err));
  process.exit(1);
});
