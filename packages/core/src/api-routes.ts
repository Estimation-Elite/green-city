import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sendHookRequest } from "./hook";
import { buildLeadFields } from "./lead-fields";

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
