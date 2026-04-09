import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      civilite,
      prenom,
      nom,
      email,
      telephone,
      codePostal,
      projetType,
      message,
      rgpd,
      utm_source,
      utm_medium,
      utm_campaign,
    } = body;

    // Validate required fields
    if (!prenom || !nom || !email || !telephone || !rgpd) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 },
      );
    }

    const leadId = crypto.randomUUID();

    const payload = {
      leadId,
      civilite,
      prenom,
      nom,
      email,
      telephone,
      codePostal,
      projetType,
      message,
      utm_source,
      utm_medium,
      utm_campaign,
      createdAt: new Date().toISOString(),
    };

    // TODO: CRM integration — replace console.log with webhook/Airtable call
    console.log("[LEAD]", JSON.stringify(payload));

    return NextResponse.json({ ok: true, leadId });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du traitement de la demande" },
      { status: 500 },
    );
  }
}
