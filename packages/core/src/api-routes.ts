import { NextRequest, NextResponse } from "next/server";
import {
  createGreenCityLead,
  findGreenCityResidenceIdByName,
  type GreenCityLeadPayload,
  type GreenCityObjective,
  type PurchaseTime,
  type FinancingValidation,
  type LeadTemperature,
} from "./greencity-api";
import { addContactToBrevoList, markContactAsRdvPris } from "./brevo";

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
  appointmentDate: string | Date | null;
  appointmentTime: string | null;
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
}

interface LeadHandlerOptions {
  defaultResidenceName?: string;
  nurturingListId?: number;
}

interface RdvHandlerOptions {
  defaultResidenceName?: string;
  nurturingListId?: number;
}

// ────────────────────────────────────────────
// Mapping helpers
// ────────────────────────────────────────────

function mapObjective(
  value?: "HABITER" | "INVESTIR",
): GreenCityObjective | undefined {
  if (!value) return undefined;
  const map: Record<string, GreenCityObjective> = {
    HABITER: "PRINCIPAL_RESIDENCE",
    INVESTIR: "INVEST",
  };
  return map[value];
}

function mapPurchaseTime(
  value?: "IMMEDIAT" | "6_MOIS" | "INDEFINI",
): PurchaseTime | undefined {
  if (!value || value === "INDEFINI") return undefined;
  const map: Record<string, PurchaseTime> = {
    IMMEDIAT: "NOW",
    "6_MOIS": "6_MONTHS",
  };
  return map[value];
}

function mapFinancingValidation(
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

function computeTemperature(
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
      } = body;

      if (!nom || !email || !telephone) {
        return NextResponse.json(
          { error: "Tous les champs requis ne sont pas renseignés." },
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

      console.log("temperature:", temperature);

      // COLD leads are not sent to the CRM — pushed to Brevo for nurturing.
      if (temperature === "COLD") {
        const apiKey = process.env.BREVO_API_KEY;
        const listId =
          options.nurturingListId ??
          (process.env.BREVO_NURTURING_LIST_ID
            ? Number(process.env.BREVO_NURTURING_LIST_ID)
            : undefined);

        console.log("apiKey:", apiKey);
        console.log("listId:", listId);

        const coldLeadErrorMessage =
          "Impossible d'enregistrer votre demande pour le moment. Merci de réessayer dans quelques instants.";

        if (!apiKey || !listId) {
          // TODO(Sentry): Sentry.captureMessage("brevo.config.missing", { level: "error" }) — firing at runtime means the deploy is misconfigured
          console.error(
            JSON.stringify({
              event: "brevo.config.missing",
              hasApiKey: Boolean(apiKey),
              hasListId: Boolean(listId),
            }),
          );
          return NextResponse.json(
            { error: coldLeadErrorMessage },
            { status: 500 },
          );
        }

        try {
          const result = await addContactToBrevoList(
            {
              email,
              firstName: prenom || nom.split(" ")[0] || nom,
              lastName: nom,
              phone: telephone,
            },
            listId,
            apiKey,
          );
          if (!result.ok) {
            // TODO(Sentry): Sentry.captureMessage("brevo.lead.upsert.failed", { level: "error", extra: { email, listId, status: result.status, body: result.body } })
            console.error(
              JSON.stringify({
                event: "brevo.lead.upsert.failed",
                email,
                listId,
                status: result.status,
                body: result.body,
              }),
            );
            return NextResponse.json(
              { error: coldLeadErrorMessage },
              { status: 500 },
            );
          }
        } catch (err) {
          // TODO(Sentry): Sentry.captureException(err, { extra: { email, listId, phase: "brevo.lead.upsert" } })
          console.error(
            JSON.stringify({
              event: "brevo.lead.upsert.threw",
              email,
              listId,
              error: err instanceof Error ? err.message : String(err),
            }),
          );
          return NextResponse.json(
            { error: coldLeadErrorMessage },
            { status: 500 },
          );
        }

        return NextResponse.json({ ok: true, temperature });
      }

      const normalizedAppointmentDate = appointmentDate
        ? new Date(appointmentDate).toISOString()
        : undefined;

      const greenCityPayload: GreenCityLeadPayload = {
        firstName: prenom || nom.split(" ")[0] || nom,
        lastName: nom,
        email,
        phoneMobile: telephone,
        objective: mapObjective(objectif),
        purchaseTime: mapPurchaseTime(purchaseTime),
        financingValidation: mapFinancingValidation(financingValidation),
        appointmentDate: normalizedAppointmentDate,
        comment: message || undefined,
        residences,
        temperature,
      };

      // Send to GreenCity API
      const result = await createGreenCityLead(greenCityPayload);

      return NextResponse.json({
        leadId: result.id,
        temperature,
      });
    } catch (error) {
      console.error("Error creating lead:", error);
      return NextResponse.json(
        { error: "Impossible de créer le lead pour le moment." },
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
      const { contact, appointmentDate, appointmentTime } = body;

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

      const dateValue = new Date(appointmentDate);
      const [h, m] = appointmentTime.split(":").map(Number);
      dateValue.setHours(h, m, 0, 0);
      const formattedDate = Number.isNaN(dateValue.getTime())
        ? undefined
        : dateValue.toISOString();

      const residences = await resolveResidenceIds({
        defaultResidenceName: options.defaultResidenceName,
      });

      const greenCityPayload: GreenCityLeadPayload = {
        firstName:
          contact.firstName || contact.name.split(" ")[0] || contact.name,
        lastName: contact.name,
        email: contact.email,
        phoneMobile: contact.phone,
        appointmentDate: formattedDate,
        residences,
        temperature: "HOT",
      };

      const result = await createGreenCityLead(greenCityPayload);

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
