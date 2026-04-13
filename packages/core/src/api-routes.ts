import { NextRequest, NextResponse } from "next/server";
import {
  createGreenCityLead,
  findGreenCityResidenceIdByName,
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
}

interface RdvHandlerOptions {
  defaultResidenceName?: string;
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
        residences,
      };

      // Send to GreenCity API
      const result = await createGreenCityLead(greenCityPayload);

      return NextResponse.json({
        leadId: result.id,
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
      const formattedDate = Number.isNaN(dateValue.getTime())
        ? undefined
        : dateValue.toISOString().split("T")[0];

      const residences = await resolveResidenceIds({
        defaultResidenceName: options.defaultResidenceName,
      });

      const greenCityPayload: GreenCityLeadPayload = {
        firstName:
          contact.firstName || contact.name.split(" ")[0] || contact.name,
        lastName: contact.name,
        email: contact.email,
        phoneMobile: contact.phone,
        appointmentDate: formattedDate
          ? `${formattedDate} ${appointmentTime}`
          : undefined,
        residences,
      };

      const result = await createGreenCityLead(greenCityPayload);

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
