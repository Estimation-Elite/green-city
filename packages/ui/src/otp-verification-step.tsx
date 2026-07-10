"use client";

import { Check, Loader2 } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import type { PhoneOtp } from "./hooks/usePhoneOtp";

interface OtpVerificationStepProps {
  /** Display only — the number the code was sent to. */
  phone: string;
  otp: PhoneOtp;
  /** "dark" for panels like park-view's hero (bg-white/10). */
  tone?: "light" | "dark";
  className?: string;
}

// Presentational OTP step. No container of its own: the parent form supplies
// the card/section chrome, same as the existing success screens.
function OtpVerificationStep({
  phone,
  otp,
  tone = "light",
  className = "",
}: OtpVerificationStepProps) {
  const isDark = tone === "dark";
  const titleClass = isDark ? "text-white" : "text-white";
  const mutedClass = isDark ? "text-white/70" : "text-muted";

  // Code validated: the lead submission (onVerified) is running — or failed
  // and can be retried. The verification itself is never lost here.
  if (otp.status === "verified") {
    return (
      <div className={`text-center space-y-4 ${className}`}>
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        {otp.finalizeFailed ? (
          <Button
            onClick={() => void otp.finalize()}
            className="w-full h-12 bg-accent hover:bg-accent-dark text-white"
          >
            Réessayer l&apos;envoi de ma demande
          </Button>
        ) : (
          <p
            className={`text-sm flex items-center justify-center gap-2 ${mutedClass}`}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Enregistrement de votre demande...
          </p>
        )}
      </div>
    );
  }

  return (
    // A real <form> so Enter submits the code — every integration renders
    // this step outside the original form (success branch), so no nesting.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void otp.verify();
      }}
      className={`text-center space-y-4 ${className}`}
    >
      <div>
        <h3 className={`text-lg font-bold ${titleClass}`}>
          Confirmez votre numéro
        </h3>
        <p className={`mt-1 text-sm ${mutedClass}`}>
          {otp.status === "sending" ? (
            <>
              Envoi d&apos;un code par SMS au{" "}
              <strong className={titleClass}>{phone}</strong>...
            </>
          ) : (
            <>
              Un code à 6 chiffres vous a été envoyé au{" "}
              <strong className={titleClass}>{phone}</strong>.
            </>
          )}
        </p>
      </div>

      {/* No maxLength: it would truncate pasted codes containing spaces
          ("123 456") before setCode strips them; setCode caps at 6 digits. */}
      <Input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label="Code de vérification à 6 chiffres"
        placeholder="000000"
        autoFocus
        value={otp.code}
        onChange={(e) => otp.setCode(e.target.value)}
        className="h-14 text-2xl text-center tracking-[0.4em] font-semibold"
      />

      <Button
        type="submit"
        disabled={otp.code.length !== 6 || otp.status !== "awaitingCode"}
        className="w-full h-12 bg-accent hover:bg-accent-dark text-white"
      >
        {otp.status === "verifying" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Vérification...
          </>
        ) : (
          "Valider le code"
        )}
      </Button>

      {otp.status !== "sending" &&
        (otp.resendCooldown > 0 ? (
          <p className={`text-sm ${mutedClass}`}>
            Renvoyer le code dans {otp.resendCooldown}s
          </p>
        ) : (
          <button
            type="button"
            onClick={() => void otp.resend()}
            disabled={otp.resending}
            className={`text-sm underline underline-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-default ${titleClass}`}
          >
            {otp.resending ? "Envoi en cours..." : "Renvoyer le code"}
          </button>
        ))}

    </form>
  );
}

export { OtpVerificationStep, type OtpVerificationStepProps };
