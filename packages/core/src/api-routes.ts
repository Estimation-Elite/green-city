import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sendHookRequest } from "./hook";
import { buildLeadFields } from "./lead-fields";
import {
  createGreenCityLead,
  type GreenCityLeadPayload,
  type GreenCityObjective,
  type PurchaseTime,
  type FinancingValidation,
} from "./greencity-api";

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
  projectAddress?: string;
  leadId?: string;
  utmSource?: string;
}

interface LeadPayload {
  leadId?: string;
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;
  situation?: string;
  message?: string;
  utmSource?: string;
  objectif?: "HABITER" | "INVESTIR";
  purchaseTime?: "IMMEDIAT" | "6_MOIS" | "INDEFINI";
  financingValidation?: "OUI" | "NON" | "EN_COURS";
  appointmentDate?: string;
  formType?: "brochure" | "callback";
  residenceId?: string;
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

function getSiteFromRequest(request: NextRequest): string | undefined {
  const host =
    request.headers.get("host") || request.headers.get("x-forwarded-host");
  if (!host) return undefined;
  return host.split(":")[0];
}

// ────────────────────────────────────────────
// Lead handler
// ────────────────────────────────────────────

export async function leadHandler(request: NextRequest) {
  try {
    const body: LeadPayload = await request.json();
    const {
      nom,
      prenom,
      email,
      telephone,
      situation,
      message,
      utmSource,
      objectif,
      purchaseTime,
      financingValidation,
      appointmentDate,
      formType,
      residenceId,
    } = body;

    if (!nom || !email || !telephone) {
      return NextResponse.json(
        { error: "Tous les champs requis ne sont pas renseignés." },
        { status: 400 },
      );
    }

    const leadId = body.leadId || uuidv4();
    const fullName = prenom ? `${prenom} ${nom}`.trim() : nom.trim();
    const source =
      formType === "callback" ? "Formulaire Rappel" : "Formulaire Brochure";

    // Build GreenCity API payload
    const greenCityPayload: GreenCityLeadPayload = {
      firstName: prenom || nom.split(" ")[0] || nom,
      lastName: nom,
      email,
      phoneMobile: telephone,
      objective: mapObjective(objectif),
      purchaseTime: mapPurchaseTime(purchaseTime),
      financingValidation: mapFinancingValidation(financingValidation),
      appointmentDate: appointmentDate || undefined,
      comment: message || undefined,
      residences: residenceId ? [residenceId] : undefined,
    };

    // Send to GreenCity API
    let greenCityLeadId: string | undefined;
    try {
      const result = await createGreenCityLead(greenCityPayload);
      greenCityLeadId = result.id;
    } catch (error) {
      console.error("[lead] GreenCity API error:", error);
      // Continue even if GreenCity fails - we still want to capture the lead via webhook
    }

    // Backward compat: also send to webhook if configured
    const hookUrl = process.env.HOOK_FORM;
    if (hookUrl) {
      try {
        const fields = buildLeadFields(
          {
            leadId,
            name: fullName,
            email,
            phone: telephone,
            situation,
            message,
            utmSource,
            site: getSiteFromRequest(request),
            objectif: objectif,
            purchaseTime: mapPurchaseTime(purchaseTime),
            financingValidation: mapFinancingValidation(financingValidation),
            appointmentDate: appointmentDate,
          },
          source,
        );

        // Remove undefined values
        for (const key of Object.keys(fields)) {
          if (fields[key] === undefined) {
            delete fields[key];
          }
        }

        await sendHookRequest(hookUrl, fields);
      } catch (error) {
        console.error("[lead] Webhook error:", error);
      }
    }

    return NextResponse.json({
      leadId: greenCityLeadId || leadId,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Impossible de créer le lead pour le moment." },
      { status: 500 },
    );
  }
}

// ────────────────────────────────────────────
// rdv (prise de rendez-vous visite)
// ────────────────────────────────────────────

export async function rdvHandler(request: NextRequest) {
  try {
    const body: VisitPayload = await request.json();
    const {
      contact,
      appointmentDate,
      appointmentTime,
      projectAddress,
      leadId: incomingLeadId,
      utmSource,
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

    const dateValue = new Date(appointmentDate);
    const formattedDate = Number.isNaN(dateValue.getTime())
      ? undefined
      : dateValue.toISOString().split("T")[0];

    const dateHeure = `${formattedDate} ${appointmentTime}`;
    const leadId = incomingLeadId || uuidv4();

    const fullName = contact.firstName
      ? `${contact.firstName} ${contact.name}`
      : contact.name;

    const fields: Record<string, string | undefined> = {
      ...buildLeadFields(
        {
          leadId,
          name: fullName,
          email: contact.email,
          phone: contact.phone,
          utmSource,
          site: getSiteFromRequest(request),
        },
        "RDV Visite",
      ),
      "Date RDV Visite": dateHeure,
    };

    if (projectAddress) {
      fields["Adresse du programme"] = projectAddress;
    }

    // Remove undefined values
    for (const key of Object.keys(fields)) {
      if (fields[key] === undefined) {
        delete fields[key];
      }
    }

    const hookUrl = process.env.HOOK_RDV || process.env.HOOK_FORM;
    if (hookUrl) {
      await sendHookRequest(hookUrl, fields);
    } else {
      console.warn(
        "[rdv] HOOK_RDV not set — skipping webhook. Payload:",
        fields,
      );
    }

    return NextResponse.json({ ok: true, leadId });
  } catch (error) {
    console.error("Error creating visit appointment:", error);
    return NextResponse.json(
      { error: "Impossible de créer le rendez-vous. Veuillez réessayer." },
      { status: 500 },
    );
  }
}
