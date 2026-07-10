// Twilio Verify v2 wrapper. The 6-digit code is generated, stored and checked
// entirely by Twilio — we never see it. The SMS template and code expiry
// (default 10 min) are owned by the Verify service; its friendly name is
// interpolated into the SMS text, hence the dedicated GreenCity service.
// Server-only: never import from client components.

// Type-only imports are erased at compile time — the runtime twilio import is
// deliberately dynamic (see getTwilioClient).
import type { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import type { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";

async function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error(
      "TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID must be set in environment variables",
    );
  }

  // Lazy import: api-routes.ts (also serving /api/lead and /api/rdv) imports
  // this module, so a twilio load failure must stay contained to the OTP
  // endpoints and never take down lead capture.
  const { default: twilio } = await import("twilio");
  return { client: twilio(accountSid, authToken), verifyServiceSid };
}

export async function sendVerificationSms(
  to: string,
): Promise<VerificationInstance> {
  try {
    const { client, verifyServiceSid } = await getTwilioClient();
    return await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to, channel: "sms", locale: "fr" });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "twilio.verify.send.failed",
        to,
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    throw error;
  }
}

export async function checkVerificationCode(
  to: string,
  code: string,
): Promise<VerificationCheckInstance> {
  const { client, verifyServiceSid } = await getTwilioClient();

  return client.verify.v2
    .services(verifyServiceSid)
    .verificationChecks.create({ to, code });
}
