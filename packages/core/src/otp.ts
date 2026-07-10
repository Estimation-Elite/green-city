// Phone verification by SMS OTP, ported from mon-meilleur-bien with the same
// timing: verification happens BEFORE the lead exists. The client sequence is
// send-otp → verify-otp → only then POST /api/lead (or /api/rdv). A prospect
// who never validates the code is never sent to GreenCity/Brevo.
//
// On a successful check, the phone lands in an in-memory verified registry
// (15 min TTL) that leadHandler/rdvHandler consult to stamp the lead as
// verified in the GreenCity comment and the Brevo TELEPHONE_VERIFIE attribute
// — server-side knowledge, not a client claim.
//
// Validation here is intentionally STRICTER than phone.ts normalizePhoneE164
// (which stays loose for the lead payload itself): each SMS send costs money,
// so the OTP path requires a libphonenumber-valid mobile number.

// The /max bundle ships the full metadata: the default ("min") bundle has no
// line-type info, so getType() would return undefined and the landline
// rejection below would silently let everything through. Server-only code,
// the extra ~100KB never reaches the client.
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js/max";
import type { CountryCode } from "libphonenumber-js";
import { checkVerificationCode, sendVerificationSms } from "./sms";

export interface JsonResponse<T = unknown> {
  status: number;
  body: T;
  headers?: Record<string, string>;
}

export interface OtpOptions {
  // Countries tried in order to parse national-format numbers. Numbers already
  // in international format (+CC...) parse independently of this list.
  acceptCountries?: CountryCode[];
  // E.164 numbers that bypass Twilio entirely (no SMS sent, any code accepted).
  testNumbers?: string[];
  // Rate-limit key component, resolved from request headers by the caller.
  ip?: string;
}

const DEFAULT_COUNTRIES: CountryCode[] = ["FR"];
const DEFAULT_TEST_NUMBERS = ["+33612345678"];

const INVALID_PHONE_ERROR =
  "Le numéro de téléphone renseigné est invalide. Merci d'indiquer un numéro français (ex. 06 12 34 56 78) ou incluant l'indicatif international (ex. +33 6 12 34 56 78).";
const MOBILE_ONLY_ERROR =
  "Merci d'indiquer un numéro de téléphone mobile pour recevoir le code par SMS.";
// Single generic message on the verify path: never reveal which check failed.
const GENERIC_VERIFY_ERROR = "Code invalide ou expiré.";
const RATE_LIMIT_ERROR = "Trop de tentatives. Réessayez plus tard.";

export function parsePhoneToE164(
  phone: string,
  countries: CountryCode[],
): string | null {
  for (const country of countries) {
    try {
      if (isValidPhoneNumber(phone, country)) {
        const parsed = parsePhoneNumberWithError(phone, country);
        // International input (+CC...) parses regardless of the country hint,
        // which would let any foreign mobile through and turn send-otp into an
        // SMS-pumping relay to premium-rate destinations. Only accept numbers
        // that actually belong to an accepted country.
        if (!parsed.country || !countries.includes(parsed.country)) {
          return null;
        }
        return parsed.format("E.164");
      }
    } catch {
      // Try the next country
    }
  }
  return null;
}

// A French landline (01-05/09) is a valid number but can't receive an SMS:
// failing early beats a Twilio error and saves the send fee. Unknown types
// (getType() undefined, e.g. some international numbers) are let through.
function isSmsCapable(phone: string, countries: CountryCode[]): boolean {
  for (const country of countries) {
    try {
      if (isValidPhoneNumber(phone, country)) {
        const type = parsePhoneNumberWithError(phone, country).getType();
        return (
          type === undefined ||
          type === "MOBILE" ||
          type === "FIXED_LINE_OR_MOBILE"
        );
      }
    } catch {
      // Try the next country
    }
  }
  return false;
}

// ────────────────────────────────────────────
// In-memory rate limiter (per IP + phone)
// ────────────────────────────────────────────
// Acceptable here: each app deploys as a single-instance Docker container.
// Resets on restart; upgrade to Redis if abuse ever spans instances.

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000; // 10 min
const MAX_SEND_ATTEMPTS = 5; // Twilio hard-blocks at 5 sends per number anyway
// Across ALL destination numbers: without this, one IP could fan out to
// unlimited distinct numbers (SMS-pumping), each with its own 5-send bucket.
const MAX_SEND_PER_IP = 10;
const MAX_VERIFY_ATTEMPTS = 8;
const SWEEP_THRESHOLD = 10_000;

function checkRateLimit(
  key: string,
  maxAttempts: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();

  // Opportunistic sweep so a key-scanning attacker can't grow the Map unbounded.
  if (attempts.size > SWEEP_THRESHOLD) {
    for (const [k, v] of attempts) {
      if (now > v.resetAt) attempts.delete(k);
    }
    // Still above the threshold means the flood happened within one window:
    // evict oldest entries (Map preserves insertion order). A legit user's
    // counter may reset early — acceptable next to memory exhaustion.
    if (attempts.size > SWEEP_THRESHOLD) {
      let excess = attempts.size - SWEEP_THRESHOLD;
      for (const k of attempts.keys()) {
        if (excess-- <= 0) break;
        attempts.delete(k);
      }
    }
  }

  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (entry.count >= maxAttempts) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true };
}

function rateLimited(retryAfterSec: number): JsonResponse<{ error: string }> {
  return {
    status: 429,
    body: { error: RATE_LIMIT_ERROR },
    headers: { "Retry-After": String(retryAfterSec) },
  };
}

// ────────────────────────────────────────────
// Verified-phone registry
// ────────────────────────────────────────────
// Written by handleVerifyOtp on a successful check, read by leadHandler /
// rdvHandler (different route chunks — hence globalThis, which guarantees a
// single instance per server process even if the module graph is duplicated
// per route). In-memory is fine: single-instance containers, and the lead
// POST follows the verification within seconds.

const VERIFIED_TTL_MS = 15 * 60 * 1000;

const verifiedPhones: Map<string, number> = ((
  globalThis as { __otpVerifiedPhones?: Map<string, number> }
).__otpVerifiedPhones ??= new Map());

function markPhoneVerified(phoneE164: string) {
  const now = Date.now();
  if (verifiedPhones.size > 1_000) {
    for (const [k, exp] of verifiedPhones) {
      if (now > exp) verifiedPhones.delete(k);
    }
  }
  verifiedPhones.set(phoneE164, now + VERIFIED_TTL_MS);
}

export function isPhoneVerified(phoneE164: string | null | undefined): boolean {
  if (!phoneE164) return false;
  const expiresAt = verifiedPhones.get(phoneE164);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    verifiedPhones.delete(phoneE164);
    return false;
  }
  return true;
}

// ────────────────────────────────────────────
// Handlers
// ────────────────────────────────────────────

export async function handleSendOtp(
  body: { phone?: unknown },
  options: OtpOptions = {},
): Promise<JsonResponse<{ ok?: boolean; error?: string }>> {
  try {
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const countries = options.acceptCountries ?? DEFAULT_COUNTRIES;
    const testNumbers = options.testNumbers ?? DEFAULT_TEST_NUMBERS;

    if (!phone) {
      return { status: 400, body: { error: "Tous les champs sont requis." } };
    }

    const formattedPhone = parsePhoneToE164(phone, countries);
    if (!formattedPhone) {
      return { status: 400, body: { error: INVALID_PHONE_ERROR } };
    }

    if (!isSmsCapable(phone, countries)) {
      return { status: 400, body: { error: MOBILE_ONLY_ERROR } };
    }

    // The test number is the ONLY environment-independent bypass: it skips
    // Twilio on send AND verify (any 6-digit code accepted), so the full UI
    // flow is walkable locally. Real numbers always go through Twilio — in
    // dev without TWILIO_* creds the send fails and the client silently
    // falls through to the success screen.
    if (testNumbers.includes(formattedPhone)) {
      console.log("[TEST] Skipping SMS for test number", formattedPhone);
      return { status: 200, body: { ok: true } };
    }

    const ip = options.ip || "unknown";
    // Per-IP cap first: when it's exhausted, don't even create per-phone
    // entries (bounds the Map growth a single IP can cause).
    const ipRl = checkRateLimit(`send-ip::${ip}`, MAX_SEND_PER_IP);
    if (!ipRl.ok) {
      return rateLimited(ipRl.retryAfterSec);
    }
    const rl = checkRateLimit(
      `send::${ip}::${formattedPhone}`,
      MAX_SEND_ATTEMPTS,
    );
    if (!rl.ok) {
      return rateLimited(rl.retryAfterSec);
    }

    try {
      await sendVerificationSms(formattedPhone);
    } catch {
      // Already logged with context inside sendVerificationSms.
      return {
        status: 500,
        body: { error: "Impossible d'envoyer le SMS. Veuillez réessayer." },
      };
    }

    return { status: 200, body: { ok: true } };
  } catch (error) {
    console.error("Error in send-otp:", error);
    return {
      status: 500,
      body: { error: "Une erreur est survenue. Veuillez réessayer." },
    };
  }
}

export async function handleVerifyOtp(
  body: { phone?: unknown; code?: unknown },
  options: OtpOptions = {},
): Promise<JsonResponse<{ ok?: boolean; error?: string }>> {
  try {
    const rawPhone = typeof body.phone === "string" ? body.phone.trim() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const countries = options.acceptCountries ?? DEFAULT_COUNTRIES;
    const testNumbers = options.testNumbers ?? DEFAULT_TEST_NUMBERS;

    if (!rawPhone || !code) {
      return { status: 400, body: { error: GENERIC_VERIFY_ERROR } };
    }

    // Same strict parse as the send path so the Twilio lookup key matches.
    const phone = parsePhoneToE164(rawPhone, countries);
    if (!phone) {
      return { status: 400, body: { error: GENERIC_VERIFY_ERROR } };
    }

    if (testNumbers.includes(phone)) {
      console.log("[TEST] Skipping verification for test number", phone);
      // Registered too: the full flow (lead tagged as verified) must be
      // walkable locally. Blast radius of the "any code works" bypass is
      // limited to leads bearing the well-known test number itself.
      markPhoneVerified(phone);
      return { status: 200, body: { ok: true } };
    }

    if (!/^\d{6}$/.test(code)) {
      return { status: 400, body: { error: GENERIC_VERIFY_ERROR } };
    }

    const ip = options.ip || "unknown";
    const rl = checkRateLimit(`verify::${ip}::${phone}`, MAX_VERIFY_ATTEMPTS);
    if (!rl.ok) {
      return rateLimited(rl.retryAfterSec);
    }

    try {
      const verification = await checkVerificationCode(phone, code);
      const approved =
        verification.valid ?? verification.status === "approved";
      if (!approved) {
        return { status: 400, body: { error: GENERIC_VERIFY_ERROR } };
      }
    } catch (verificationError) {
      // Twilio also throws on expired/consumed verifications (404) — same
      // generic answer as a wrong code.
      console.error(
        JSON.stringify({
          event: "twilio.verify.check.failed",
          phone,
          error:
            verificationError instanceof Error
              ? verificationError.message
              : String(verificationError),
        }),
      );
      return { status: 400, body: { error: GENERIC_VERIFY_ERROR } };
    }

    markPhoneVerified(phone);
    return { status: 200, body: { ok: true } };
  } catch (error) {
    console.error("Error in verify-otp:", error);
    return { status: 500, body: { error: "Une erreur est survenue." } };
  }
}
