import crypto from "node:crypto";
import { NextRequest } from "next/server";
import { normalizeInboundLead, type InboundLead } from "@/lib/field-mapping";
import { pushLeadToGreenCity } from "@/lib/push-greencity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function logError(event: string, extra: Record<string, unknown>) {
  console.error(JSON.stringify({ event, ...extra }));
}

function timingSafeBearer(header: string | null, expected: string): boolean {
  if (!header) return false;
  const prefix = "Bearer ";
  if (!header.startsWith(prefix)) return false;
  const provided = header.slice(prefix.length).trim();
  if (provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.INBOUND_SECRET;
  if (!expectedSecret) {
    logError("fb.inbound.config_missing", { var: "INBOUND_SECRET" });
    return jsonResponse(500, { error: "Server misconfigured" });
  }

  if (!timingSafeBearer(request.headers.get("authorization"), expectedSecret)) {
    return jsonResponse(401, { error: "Unauthorized" });
  }

  let body: InboundLead;
  try {
    body = (await request.json()) as InboundLead;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" });
  }

  if (!body || typeof body !== "object") {
    return jsonResponse(400, { error: "Payload invalide" });
  }

  const lead = normalizeInboundLead(body);

  // Trace toute réponse présente en entrée mais non reconnue par la
  // classification, pour pouvoir enrichir les mots-clés avec les vrais
  // libellés FB. Évite tout drop silencieux.
  const unmapped: Array<[string, string | undefined, unknown]> = [
    ["objectif", lead.objectif, body.objectif],
    ["horizon_achat", lead.horizonAchat, body.horizon_achat],
    ["financement", lead.financement, body.financement],
  ];
  for (const [field, normalized, raw] of unmapped) {
    if (!normalized && typeof raw === "string" && raw.trim()) {
      console.warn(
        JSON.stringify({ event: "fb.inbound.unmapped_answer", field, raw }),
      );
    }
  }

  const result = await pushLeadToGreenCity(lead, "FB lead inbound");

  if (!result.ok) {
    return jsonResponse(result.status, { error: result.error });
  }

  return jsonResponse(200, {
    ok: true,
    leadId: result.leadId,
    temperature: result.temperature,
  });
}
