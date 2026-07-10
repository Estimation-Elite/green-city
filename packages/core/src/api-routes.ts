import { NextRequest, NextResponse } from "next/server";
import { fromZonedTime } from "date-fns-tz";
import {
  createGreenCityLead,
  findGreenCityResidenceIdByName,
  type GreenCityLeadPayload,
  type GreenCityObjective,
  type PurchaseTime,
  type FinancingValidation,
  type LeadTemperature,
} from "./greencity-api";
import {
  addContactToBrevoList,
  markContactAsRdvPris,
  sendBrevoTransactionalEmail,
} from "./brevo";
import { normalizePhoneE164 } from "./phone";
import { handleSendOtp, handleVerifyOtp, isPhoneVerified } from "./otp";
import type { OtpOptions } from "./otp";

const APPOINTMENT_TIMEZONE = "Europe/Paris";
const APPOINTMENT_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const APPOINTMENT_TIME_REGEX = /^\d{2}:\d{2}$/;

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface VisitPayload {
  contact: {
    firstName?: string;
    name: string;
    email: string;
    phone: string;
  };
  appointmentDate: string | null;
  appointmentTime: string | null;
  message?: string;
  residenceRef?: string;
}

interface LeadPayload {
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;
  message?: string;
  objectif?: "HABITER" | "INVESTIR";
  purchaseTime?: "IMMEDIAT" | "6_MOIS" | "INDEFINI";
  financingValidation?: "OUI" | "NON" | "EN_COURS";
  appointmentDate?: string;
  residenceRef?: string;
  residenceId?: string;
  formType?: "brochure" | "callback";
}

interface LeadHandlerOptions {
  defaultResidenceName?: string;
  nurturingListId?: number;
  allLeadsListId?: number;
}

interface RdvHandlerOptions {
  defaultResidenceName?: string;
  nurturingListId?: number;
  rdvListId?: number;
  allLeadsListId?: number;
  // Numeric enum value of the Brevo "PROGRAMME" category attribute for this
  // app. PROGRAMME is a category-type attribute in Brevo (not free text), so
  // the upsert must send a numeric ID matching one of the predefined enum
  // values. Leave undefined to skip setting it (e.g. park-view).
  rdvProgrammeCategoryValue?: number;
}

function resolveAllLeadsListId(options: { allLeadsListId?: number }): number | undefined {
  if (options.allLeadsListId !== undefined) return options.allLeadsListId;
  const envValue = process.env.BREVO_ALL_LEADS_LIST_ID;
  if (!envValue) return undefined;
  const parsed = Number(envValue);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

// ────────────────────────────────────────────
// Mapping helpers
// ────────────────────────────────────────────

export function mapObjective(
  value?: "HABITER" | "INVESTIR",
): GreenCityObjective | undefined {
  if (!value) return undefined;
  const map: Record<string, GreenCityObjective> = {
    HABITER: "PRINCIPAL_RESIDENCE",
    INVESTIR: "INVEST",
  };
  return map[value];
}

export function mapPurchaseTime(
  value?: "IMMEDIAT" | "6_MOIS" | "INDEFINI",
): PurchaseTime | undefined {
  if (!value || value === "INDEFINI") return undefined;
  const map: Record<string, PurchaseTime> = {
    IMMEDIAT: "NOW",
    "6_MOIS": "6_MONTHS",
  };
  return map[value];
}

// HORIZON_ACHAT côté Brevo est un attribut Catégorie avec un schéma en
// buckets mois (0_3M, 3_6M, 6_12M, 12M_PLUS, NON_DEFINI) — granularité
// commerciale historique étendue avec NON_DEFINI pour couvrir les leads
// formulaire « je m'informe ». Brevo drop silencieusement toute valeur
// hors-schéma, donc on mappe explicitement les 3 réponses du formulaire.
export function mapPurchaseTimeForBrevo(
  value?: "IMMEDIAT" | "6_MOIS" | "INDEFINI",
): "0_3M" | "3_6M" | "NON_DEFINI" | undefined {
  if (!value) return undefined;
  const map: Record<string, "0_3M" | "3_6M" | "NON_DEFINI"> = {
    IMMEDIAT: "0_3M",
    "6_MOIS": "3_6M",
    INDEFINI: "NON_DEFINI",
  };
  return map[value];
}

export function mapFinancingValidation(
  value?: "OUI" | "NON" | "EN_COURS",
): FinancingValidation | undefined {
  if (!value) return undefined;
  const map: Record<string, FinancingValidation> = {
    OUI: "YES",
    NON: "NO",
    EN_COURS: "IN_PROGRESS",
  };
  return map[value];
}

// ────────────────────────────────────────────
// Temperature scoring
// ────────────────────────────────────────────

export function computeTemperature(
  formType: "lead" | "rdv",
  payload: {
    objectif?: string;
    purchaseTime?: string;
    financingValidation?: string;
  },
): LeadTemperature {
  // RDV / visite → toujours HOT
  if (formType === "rdv") return "HOT";

  const hasValidFinancing = payload.financingValidation === "OUI";
  const hasMaybeFinancing = payload.financingValidation === "EN_COURS";
  const hasShortTimeline =
    payload.purchaseTime === "IMMEDIAT" || payload.purchaseTime === "6_MOIS";
  const hasObjective = !!payload.objectif;

  // Financement validé + délai court → HOT
  if (hasValidFinancing && hasShortTimeline) return "HOT";

  // Objectif défini mais financement flou → LUKEWARM
  if (hasObjective && hasMaybeFinancing) return "LUKEWARM";

  // Tout le reste → COLD
  return "COLD";
}

// ────────────────────────────────────────────
// Lead handler
// ────────────────────────────────────────────

function parseResidenceId(residenceId?: string) {
  if (!residenceId) return undefined;
  const parsed = Number(residenceId);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function parseResidenceName(residenceId?: string) {
  if (!residenceId) return undefined;
  const trimmed = residenceId.trim();

  if (!trimmed) {
    return undefined;
  }

  return parseResidenceId(trimmed) === undefined ? trimmed : undefined;
}

async function resolveResidenceIds({
  residenceRef,
  defaultResidenceName,
}: {
  residenceRef?: string;
  defaultResidenceName?: string;
}) {
  const explicitResidenceId = parseResidenceId(residenceRef);

  if (explicitResidenceId !== undefined) {
    return [explicitResidenceId];
  }

  const explicitResidenceName = parseResidenceName(residenceRef);
  const configuredResidenceName =
    explicitResidenceName ||
    process.env.GREENCITY_RESIDENCE_NAME ||
    defaultResidenceName;

  if (!configuredResidenceName) {
    return undefined;
  }

  const resolvedResidenceId = await findGreenCityResidenceIdByName(
    configuredResidenceName,
  );

  if (resolvedResidenceId === undefined) {
    throw new Error(
      `Impossible de resoudre la residence GreenCity "${configuredResidenceName}".`,
    );
  }

  return [resolvedResidenceId];
}

// Fire-and-forget transactional email helpers. They never throw (the Brevo
// client returns a result object on failure) and they swallow misconfiguration
// (missing env var, missing apiKey) silently — the primary action is already
// committed by the time they're called.

function fireBrochureAcknowledgment(params: {
  email: string;
  name: string;
  firstName: string;
  programme: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const templateId = Number(process.env.BREVO_TEMPLATE_ID_LEAD_ACKNOWLEDGMENT);
  if (!apiKey || !templateId) return;

  void sendBrevoTransactionalEmail(
    {
      to: [{ email: params.email, name: params.name }],
      templateId,
      params: {
        FIRSTNAME: params.firstName,
        PROGRAMME: params.programme,
      },
    },
    apiKey,
  );
}

function fireRdvConfirmation(params: {
  email: string;
  name: string;
  firstName: string;
  programme: string;
  appointmentDate: Date;
  hour: number;
  minute: number;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const templateId = Number(process.env.BREVO_TEMPLATE_ID_RDV_CONFIRMATION);
  if (!apiKey || !templateId) return;

  const dateLabel = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: APPOINTMENT_TIMEZONE,
  }).format(params.appointmentDate);
  const timeLabel = `${String(params.hour).padStart(2, "0")}:${String(params.minute).padStart(2, "0")}`;

  void sendBrevoTransactionalEmail(
    {
      to: [{ email: params.email, name: params.name }],
      templateId,
      params: {
        FIRSTNAME: params.firstName,
        PROGRAMME: params.programme,
        APPOINTMENT_DATE: dateLabel,
        APPOINTMENT_TIME: timeLabel,
      },
    },
    apiKey,
  );
}

// Upsert the contact into the RDV list (+ "Tous leads" if configured) with
// RDV_DATE / RDV_TIME / PROGRAMME / TEMPERATURE so that a Brevo automation
// workflow can schedule a J-1 reminder relative to RDV_DATE. Brevo's
// /smtp/email scheduledAt caps at 72h, which is unusable for visits booked
// weeks in advance — routing through a list + workflow lifts that limit.
// Fire-and-forget: the RDV is already committed in GreenCity.
function fireRdvBrevoUpsert(params: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneVerified: boolean;
  programmeCategoryValue?: number;
  appointmentDate: Date;
  appointmentTime: string;
  listIds: number[];
  message?: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || params.listIds.length === 0) return;

  void addContactToBrevoList(
    {
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      attributes: {
        TEMPERATURE: "HOT",
        // Server-side knowledge from the OTP verified registry — describes
        // the phone stored by this upsert.
        TELEPHONE_VERIFIE: params.phoneVerified,
        RDV_DATE: params.appointmentDate.toISOString(),
        RDV_TIME: params.appointmentTime,
        ...(params.programmeCategoryValue !== undefined
          ? { PROGRAMME: params.programmeCategoryValue }
          : {}),
        ...(params.message ? { MESSAGE: params.message } : {}),
      },
    },
    params.listIds,
    apiKey,
  )
    .then((result) => {
      if (!result.ok) {
        // TODO(Sentry): Sentry.captureMessage("brevo.rdv.upsert.failed", { level: "error", extra: { email: params.email, listIds: params.listIds, status: result.status, body: result.body } })
        console.error(
          JSON.stringify({
            event: "brevo.rdv.upsert.failed",
            email: params.email,
            listIds: params.listIds,
            status: result.status,
            body: result.body,
          }),
        );
      }
    })
    .catch((err) => {
      // TODO(Sentry): Sentry.captureException(err, { extra: { email: params.email, listIds: params.listIds, phase: "brevo.rdv.upsert" } })
      console.error(
        JSON.stringify({
          event: "brevo.rdv.upsert.threw",
          email: params.email,
          listIds: params.listIds,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
    });
}

// Upsert the contact into the "Tous leads" registry list with TEMPERATURE.
// This list has no Brevo workflow attached — it's a pure CRM record so the
// marketing team can see every lead and segment by temperature. Fire-and-
// forget: GreenCity is the source of truth for HOT/LUKEWARM and a Brevo
// outage must not surface as a form 500.
function fireAllLeadsBrevoUpsert(params: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneVerified: boolean;
  temperature: LeadTemperature;
  listId: number;
  objectif?: "HABITER" | "INVESTIR";
  purchaseTime?: "IMMEDIAT" | "6_MOIS" | "INDEFINI";
  financingValidation?: "OUI" | "NON" | "EN_COURS";
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const horizonAchat = mapPurchaseTimeForBrevo(params.purchaseTime);
  void addContactToBrevoList(
    {
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      attributes: {
        TEMPERATURE: params.temperature,
        // Server-side knowledge from the OTP verified registry — describes
        // the phone stored by this upsert.
        TELEPHONE_VERIFIE: params.phoneVerified,
        ...(params.objectif !== undefined ? { OBJECTIF: params.objectif } : {}),
        ...(horizonAchat !== undefined ? { HORIZON_ACHAT: horizonAchat } : {}),
        ...(params.financingValidation !== undefined
          ? { FINANCEMENT: params.financingValidation }
          : {}),
      },
    },
    params.listId,
    apiKey,
  )
    .then((result) => {
      if (!result.ok) {
        // TODO(Sentry): Sentry.captureMessage("brevo.allleads.upsert.failed", { level: "error", extra: { email: params.email, listId: params.listId, status: result.status, body: result.body } })
        console.error(
          JSON.stringify({
            event: "brevo.allleads.upsert.failed",
            email: params.email,
            listId: params.listId,
            status: result.status,
            body: result.body,
          }),
        );
      }
    })
    .catch((err) => {
      // TODO(Sentry): Sentry.captureException(err, { extra: { email: params.email, listId: params.listId, phase: "brevo.allleads.upsert" } })
      console.error(
        JSON.stringify({
          event: "brevo.allleads.upsert.threw",
          email: params.email,
          listId: params.listId,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
    });
}

// Upsert a COLD lead into the Brevo nurturing list (which has an email
// automation workflow attached). All leads now go to GreenCity, but COLD ones
// keep feeding this nurturing list. Fire-and-forget: GreenCity is the source of
// truth, so a Brevo outage must not surface as a form 500. Resolves the list id
// from the handler options or BREVO_NURTURING_LIST_ID and no-ops if unset.
function fireNurturingBrevoUpsert(params: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneVerified: boolean;
  nurturingListId?: number;
  objectif?: "HABITER" | "INVESTIR";
  purchaseTime?: "IMMEDIAT" | "6_MOIS" | "INDEFINI";
  financingValidation?: "OUI" | "NON" | "EN_COURS";
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const nurturingListId =
    params.nurturingListId ??
    (process.env.BREVO_NURTURING_LIST_ID
      ? Number(process.env.BREVO_NURTURING_LIST_ID)
      : undefined);
  if (
    !apiKey ||
    typeof nurturingListId !== "number" ||
    !Number.isInteger(nurturingListId) ||
    nurturingListId <= 0
  ) {
    return;
  }

  const horizonAchat = mapPurchaseTimeForBrevo(params.purchaseTime);
  void addContactToBrevoList(
    {
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      attributes: {
        TEMPERATURE: "COLD",
        // Server-side knowledge from the OTP verified registry — describes
        // the phone stored by this upsert.
        TELEPHONE_VERIFIE: params.phoneVerified,
        ...(params.objectif !== undefined ? { OBJECTIF: params.objectif } : {}),
        ...(horizonAchat !== undefined ? { HORIZON_ACHAT: horizonAchat } : {}),
        ...(params.financingValidation !== undefined
          ? { FINANCEMENT: params.financingValidation }
          : {}),
      },
    },
    nurturingListId,
    apiKey,
  )
    .then((result) => {
      if (!result.ok) {
        // TODO(Sentry): Sentry.captureMessage("brevo.nurturing.upsert.failed", { level: "error", extra: { email: params.email, listId: nurturingListId, status: result.status, body: result.body } })
        console.error(
          JSON.stringify({
            event: "brevo.nurturing.upsert.failed",
            email: params.email,
            listId: nurturingListId,
            status: result.status,
            body: result.body,
          }),
        );
      }
    })
    .catch((err) => {
      // TODO(Sentry): Sentry.captureException(err, { extra: { email: params.email, listId: nurturingListId, phase: "brevo.nurturing.upsert" } })
      console.error(
        JSON.stringify({
          event: "brevo.nurturing.upsert.threw",
          email: params.email,
          listId: nurturingListId,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
    });
}

// The GreenCity ERP has no lead-update endpoint and no verified-phone field,
// so the OTP outcome is stamped into the comment at creation time — the only
// surface the sales team sees.
function buildLeadComment(
  message: string | undefined,
  phoneVerified: boolean,
): string | undefined {
  const tag = phoneVerified ? "Téléphone vérifié par SMS." : undefined;
  const parts = [message, tag].filter(Boolean);
  return parts.length > 0 ? parts.join("\n\n") : undefined;
}

export function createLeadHandler(options: LeadHandlerOptions = {}) {
  return async function leadHandler(request: NextRequest) {
    try {
      const body: LeadPayload = await request.json();
      const {
        nom,
        prenom,
        email,
        telephone,
        message,
        objectif,
        purchaseTime,
        financingValidation,
        appointmentDate,
        residenceRef,
        residenceId,
        formType,
      } = body;

      if (!nom || !email || !telephone) {
        return NextResponse.json(
          { error: "Tous les champs requis ne sont pas renseignés." },
          { status: 400 },
        );
      }

      const normalizedPhone = normalizePhoneE164(telephone);
      if (!normalizedPhone) {
        return NextResponse.json(
          {
            error:
              "Le numéro de téléphone renseigné est invalide. Merci d'indiquer un numéro français (ex. 06 12 34 56 78) ou incluant l'indicatif international (ex. +33 6 12 34 56 78).",
          },
          { status: 400 },
        );
      }

      // Build GreenCity API payload
      const residences = await resolveResidenceIds({
        residenceRef: residenceRef || residenceId,
        defaultResidenceName: options.defaultResidenceName,
      });

      const temperature = computeTemperature("lead", {
        objectif,
        purchaseTime,
        financingValidation,
      });

      const allLeadsListId = resolveAllLeadsListId(options);

      const normalizedAppointmentDate = appointmentDate
        ? new Date(appointmentDate).toISOString()
        : undefined;

      // The form flow verifies the phone (OTP) BEFORE posting the lead, so a
      // registry miss means a caller that bypassed the UI (bot, direct API) —
      // the lead is still accepted, just not stamped as verified.
      const phoneVerified = isPhoneVerified(normalizedPhone);
      if (!phoneVerified) {
        console.warn(
          JSON.stringify({ event: "lead.phone_unverified", email }),
        );
      }

      const greenCityPayload: GreenCityLeadPayload = {
        firstName: prenom || nom.split(" ")[0] || nom,
        lastName: nom,
        email,
        phoneMobile: normalizedPhone,
        objective: mapObjective(objectif),
        purchaseTime: mapPurchaseTime(purchaseTime),
        financingValidation: mapFinancingValidation(financingValidation),
        appointmentDate: normalizedAppointmentDate,
        comment: buildLeadComment(message, phoneVerified),
        residences,
        temperature,
      };

      // Send to GreenCity API
      const result = await createGreenCityLead(greenCityPayload);

      if (allLeadsListId) {
        fireAllLeadsBrevoUpsert({
          email,
          firstName: prenom || nom.split(" ")[0] || nom,
          lastName: nom,
          phone: telephone,
          phoneVerified,
          temperature,
          listId: allLeadsListId,
          objectif,
          purchaseTime,
          financingValidation,
        });
      }

      // COLD leads still feed the Brevo nurturing automation (fire-and-forget:
      // GreenCity already accepted the lead, a Brevo outage must not 500).
      if (temperature === "COLD") {
        fireNurturingBrevoUpsert({
          email,
          firstName: prenom || nom.split(" ")[0] || nom,
          lastName: nom,
          phone: telephone,
          phoneVerified,
          nurturingListId: options.nurturingListId,
          objectif,
          purchaseTime,
          financingValidation,
        });
      }

      if (formType === "brochure") {
        fireBrochureAcknowledgment({
          email,
          name: nom,
          firstName: prenom || nom.split(" ")[0] || nom,
          programme: options.defaultResidenceName ?? "",
        });
      }

      return NextResponse.json({
        leadId: result.id,
        temperature,
      });
    } catch (error) {
      console.error("Error creating lead:", error);
      return NextResponse.json(
        {
          error:
            "La demande n'a pas pu être enregistrée pour le moment. Merci de réessayer dans quelques instants.",
        },
        { status: 500 },
      );
    }
  };
}

export const leadHandler = createLeadHandler();

// ────────────────────────────────────────────
// rdv (prise de rendez-vous visite)
// ────────────────────────────────────────────

export function createRdvHandler(options: RdvHandlerOptions = {}) {
  return async function rdvHandler(request: NextRequest) {
    try {
      const body: VisitPayload = await request.json();
      const {
        contact,
        appointmentDate,
        appointmentTime,
        message,
        residenceRef,
      } = body;

      if (
        !contact?.name ||
        !contact?.email ||
        !contact?.phone ||
        !appointmentDate ||
        !appointmentTime
      ) {
        return NextResponse.json(
          { error: "Champs manquants pour créer le rendez-vous." },
          { status: 400 },
        );
      }

      if (
        !APPOINTMENT_DATE_REGEX.test(appointmentDate) ||
        !APPOINTMENT_TIME_REGEX.test(appointmentTime)
      ) {
        return NextResponse.json(
          { error: "Date ou heure de rendez-vous invalide." },
          { status: 400 },
        );
      }

      const normalizedPhone = normalizePhoneE164(contact.phone);
      if (!normalizedPhone) {
        return NextResponse.json(
          {
            error:
              "Le numéro de téléphone renseigné est invalide. Merci d'indiquer un numéro français (ex. 06 12 34 56 78) ou incluant l'indicatif international (ex. +33 6 12 34 56 78).",
          },
          { status: 400 },
        );
      }

      const [h, m] = appointmentTime.split(":").map(Number);
      const dateValue = fromZonedTime(
        `${appointmentDate}T${appointmentTime}:00`,
        APPOINTMENT_TIMEZONE,
      );
      const formattedDate = Number.isNaN(dateValue.getTime())
        ? undefined
        : dateValue.toISOString();

      const residences = await resolveResidenceIds({
        residenceRef,
        defaultResidenceName: options.defaultResidenceName,
      });

      // Same OTP-before-lead flow as leadHandler: a registry miss means the
      // UI was bypassed; the RDV is still accepted, just not stamped.
      const phoneVerified = isPhoneVerified(normalizedPhone);
      if (!phoneVerified) {
        console.warn(
          JSON.stringify({
            event: "rdv.phone_unverified",
            email: contact.email,
          }),
        );
      }

      const greenCityPayload: GreenCityLeadPayload = {
        firstName:
          contact.firstName || contact.name.split(" ")[0] || contact.name,
        lastName: contact.name,
        email: contact.email,
        phoneMobile: normalizedPhone,
        appointmentDate: formattedDate,
        comment: buildLeadComment(message, phoneVerified),
        residences,
        temperature: "HOT",
      };

      const result = await createGreenCityLead(greenCityPayload);

      const allLeadsListId = resolveAllLeadsListId(options);
      const rdvUpsertListIds = [allLeadsListId, options.rdvListId].filter(
        (id): id is number => typeof id === "number",
      );

      if (rdvUpsertListIds.length > 0 && !Number.isNaN(dateValue.getTime())) {
        fireRdvBrevoUpsert({
          email: contact.email,
          firstName:
            contact.firstName || contact.name.split(" ")[0] || contact.name,
          lastName: contact.name,
          phone: contact.phone,
          phoneVerified,
          programmeCategoryValue: options.rdvProgrammeCategoryValue,
          appointmentDate: dateValue,
          appointmentTime: appointmentTime,
          listIds: rdvUpsertListIds,
          message,
        });
      }

      // Mark RDV_PRIS=true on the Brevo contact (if it exists) to exit the
      // nurturing workflow. Never creates a contact: a 404 is silent.
      // The RDV is already saved in GreenCity at this point — on Brevo
      // failure we surface an error whose copy confirms the RDV exists,
      // so the user doesn't re-submit and create a duplicate.
      const rdvBrevoErrorMessage =
        "Votre rendez-vous a bien été enregistré, mais un problème technique est survenu. Notre équipe vous recontactera pour confirmation.";
      const apiKey = process.env.BREVO_API_KEY;
      if (apiKey && options.nurturingListId) {
        try {
          const brevoResult = await markContactAsRdvPris(contact.email, apiKey);
          if (!brevoResult.updated && brevoResult.status === 404) {
            // Normal: contact was never nurtured (HOT lead from the start). Info-only.
            console.info(
              JSON.stringify({
                event: "brevo.rdv.contact.unknown",
                email: contact.email,
              }),
            );
          } else if (!brevoResult.updated) {
            // Non-404 failure: already logged inside markContactAsRdvPris.
            // TODO(Sentry): Sentry.captureMessage("brevo.rdv.update.failed", { level: "error", extra: { email: contact.email, status: brevoResult.status } })
            return NextResponse.json(
              { error: rdvBrevoErrorMessage, leadId: result.id },
              { status: 500 },
            );
          }
        } catch (err) {
          // TODO(Sentry): Sentry.captureException(err, { extra: { email: contact.email, phase: "brevo.rdv.update" } })
          console.error(
            JSON.stringify({
              event: "brevo.rdv.update.threw",
              email: contact.email,
              error: err instanceof Error ? err.message : String(err),
            }),
          );
          return NextResponse.json(
            { error: rdvBrevoErrorMessage, leadId: result.id },
            { status: 500 },
          );
        }
      }

      if (!Number.isNaN(dateValue.getTime())) {
        fireRdvConfirmation({
          email: contact.email,
          name: contact.name,
          firstName:
            contact.firstName || contact.name.split(" ")[0] || contact.name,
          programme: options.defaultResidenceName ?? "",
          appointmentDate: dateValue,
          hour: h,
          minute: m,
        });
      }

      return NextResponse.json({ ok: true, leadId: result.id });
    } catch (error) {
      console.error("Error creating visit appointment:", error);
      return NextResponse.json(
        { error: "Impossible de créer le rendez-vous. Veuillez réessayer." },
        { status: 500 },
      );
    }
  };
}

export const rdvHandler = createRdvHandler();

// ────────────────────────────────────────────
// Phone verification (SMS OTP via Twilio Verify)
// ────────────────────────────────────────────
// Same timing as mon-meilleur-bien: the client verifies the phone FIRST
// (send-otp → verify-otp) and only then POSTs the lead. A prospect who never
// validates the code is never sent to GreenCity/Brevo. The verified registry
// filled by verify-otp lets leadHandler/rdvHandler stamp the lead server-side.

export type OtpHandlerOptions = Pick<
  OtpOptions,
  "acceptCountries" | "testNumbers"
>;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function createSendOtpHandler(options: OtpHandlerOptions = {}) {
  return async function sendOtpHandler(request: NextRequest) {
    try {
      const body = await request.json();
      const result = await handleSendOtp(body, {
        ...options,
        ip: getClientIp(request),
      });
      return NextResponse.json(result.body, {
        status: result.status,
        headers: result.headers,
      });
    } catch (error) {
      console.error("Error in send-otp:", error);
      return NextResponse.json(
        { error: "Une erreur est survenue. Veuillez réessayer." },
        { status: 500 },
      );
    }
  };
}

export function createVerifyOtpHandler(options: OtpHandlerOptions = {}) {
  return async function verifyOtpHandler(request: NextRequest) {
    try {
      const body = await request.json();
      // On success, handleVerifyOtp records the phone in the verified
      // registry; the subsequent /api/lead or /api/rdv POST reads it to stamp
      // the lead (GreenCity comment + Brevo TELEPHONE_VERIFIE).
      const result = await handleVerifyOtp(body, {
        ...options,
        ip: getClientIp(request),
      });

      return NextResponse.json(result.body, {
        status: result.status,
        headers: result.headers,
      });
    } catch (error) {
      console.error("Error in verify-otp:", error);
      return NextResponse.json(
        { error: "Une erreur est survenue." },
        { status: 500 },
      );
    }
  };
}
