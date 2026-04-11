import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sendHookRequest } from "./hook";
import { buildLeadFields } from "./lead-fields";

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
  prenom: string;
  email: string;
  telephone: string;
  situation?: string;
  message?: string;
  utmSource?: string;
}

function getSiteFromRequest(request: NextRequest): string | undefined {
  const host =
    request.headers.get("host") || request.headers.get("x-forwarded-host");
  if (!host) return undefined;
  return host.split(":")[0];
}

export async function leadHandler(request: NextRequest) {
  try {
    const body: LeadPayload = await request.json();
    const { nom, email, telephone, situation, message, utmSource } =
      body;

    if (!nom || !email || !telephone) {
      return NextResponse.json(
        { error: "Tous les champs requis ne sont pas renseignés." },
        { status: 400 },
      );
    }

    const leadId = body.leadId || uuidv4();

    const fields = buildLeadFields(
      {
        leadId,
        name: `${nom}`.trim(),
        email,
        phone: telephone,
        situation,
        message,
        utmSource,
        site: getSiteFromRequest(request),
      },
      "Formulaire",
    );

    // Remove undefined values
    for (const key of Object.keys(fields)) {
      if (fields[key] === undefined) {
        delete fields[key];
      }
    }

    const hookUrl = process.env.HOOK_FORM;
    if (hookUrl) {
      await sendHookRequest(hookUrl, fields);
    } else {
      console.warn(
        "[lead] HOOK_FORM not set — skipping webhook. Payload:",
        fields,
      );
    }

    return NextResponse.json({ leadId });
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
