"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Pre-submission phone verification state machine — same timing as
// mon-meilleur-bien: the form calls start() INSTEAD of posting the lead;
// only after the code is validated does the hook run `onVerified` (the
// form's actual lead submission). A prospect who never validates the code
// is never sent to the CRM.

export type PhoneOtpStatus =
  | "idle"
  | "sending"
  | "awaitingCode"
  | "verifying"
  | "verified";

export interface SendOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  code: string;
}

export interface UsePhoneOtpOptions {
  /**
   * The form's lead submission, run after the code is validated. Must THROW
   * on failure (with a user-readable French message): the hook toasts it and
   * shows a retry button on the OTP step.
   */
  onVerified: () => Promise<void>;
  sendOtp?: (payload: SendOtpPayload) => Promise<void>;
  verifyOtp?: (payload: VerifyOtpPayload) => Promise<void>;
}

export interface PhoneOtp {
  status: PhoneOtpStatus;
  /** True while the OTP step should replace the form/success screen. */
  stepVisible: boolean;
  code: string;
  setCode: (raw: string) => void;
  /** Seconds before "Renvoyer le code" becomes available (0 = available). */
  resendCooldown: number;
  /** True while a resend request is in flight. */
  resending: boolean;
  /** True when onVerified (the lead submission) failed — show retry. */
  finalizeFailed: boolean;
  start: (args: { phone: string }) => Promise<void>;
  verify: () => Promise<void>;
  resend: () => Promise<void>;
  /** Re-run onVerified after a failure (the phone stays verified). */
  finalize: () => Promise<void>;
}

const RESEND_COOLDOWN_SECONDS = 45;
const NETWORK_ERROR = "Erreur de connexion. Veuillez réessayer.";

const defaultSendOtp = async ({ phone }: SendOtpPayload) => {
  const response = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || NETWORK_ERROR);
  }
};

const defaultVerifyOtp = async ({ phone, code }: VerifyOtpPayload) => {
  const response = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || NETWORK_ERROR);
  }
};

export function usePhoneOtp(options: UsePhoneOtpOptions): PhoneOtp {
  const { onVerified } = options;
  const sendOtp = options.sendOtp ?? defaultSendOtp;
  const verifyOtp = options.verifyOtp ?? defaultVerifyOtp;

  const [status, setStatusState] = useState<PhoneOtpStatus>("idle");
  const [code, setCodeState] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [finalizeFailed, setFinalizeFailed] = useState(false);
  // Mirror of `status` readable synchronously inside async callbacks,
  // avoiding stale-closure guards.
  const statusRef = useRef<PhoneOtpStatus>("idle");
  // Synchronous in-flight guards (state updates are async).
  const startingRef = useRef(false);
  const resendingRef = useRef(false);
  const finalizingRef = useRef(false);
  // Snapshot of the phone being verified: forms may mutate their own state
  // while the OTP step operates on the submitted value.
  const phoneRef = useRef<string | null>(null);

  const setStatus = useCallback((s: PhoneOtpStatus) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);

  // Function call defeats TS control-flow narrowing on statusRef.current,
  // which would otherwise persist stale across awaits/setStatus calls.
  const currentStatus = useCallback((): PhoneOtpStatus => statusRef.current, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const setCode = useCallback((raw: string) => {
    setCodeState(raw.replace(/\D/g, "").slice(0, 6));
  }, []);

  // Runs the form's lead submission once the phone is verified. Failures
  // surface as a toast + retry button — the verification itself is not lost.
  const runFinalize = useCallback(async () => {
    if (finalizingRef.current) return;
    finalizingRef.current = true;
    setFinalizeFailed(false);
    try {
      await onVerified();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : NETWORK_ERROR);
      setFinalizeFailed(true);
    } finally {
      finalizingRef.current = false;
    }
  }, [onVerified]);

  const start = useCallback(
    async (args: { phone: string }) => {
      if (startingRef.current || currentStatus() !== "idle") return;
      startingRef.current = true;
      phoneRef.current = args.phone;
      setStatus("sending");
      try {
        await sendOtp({ phone: args.phone });
        setStatus("awaitingCode");
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      } catch (error) {
        // Blocking flow: without a verified phone no lead is created, so the
        // user must see why the SMS could not be sent (invalid number,
        // landline...) and fix it — back to the form.
        toast.error(error instanceof Error ? error.message : NETWORK_ERROR);
        phoneRef.current = null;
        setStatus("idle");
      } finally {
        startingRef.current = false;
      }
    },
    [sendOtp, setStatus, currentStatus],
  );

  const verify = useCallback(async () => {
    const phone = phoneRef.current;
    if (!phone || currentStatus() !== "awaitingCode" || code.length !== 6) {
      return;
    }
    setStatus("verifying");
    try {
      await verifyOtp({ phone, code });
      setStatus("verified");
      await runFinalize();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : NETWORK_ERROR);
      // Keep the entered code so the user can correct a typo.
      setStatus("awaitingCode");
    }
  }, [code, verifyOtp, setStatus, currentStatus, runFinalize]);

  const resend = useCallback(async () => {
    const phone = phoneRef.current;
    if (
      !phone ||
      currentStatus() !== "awaitingCode" ||
      resendCooldown > 0 ||
      resendingRef.current // in-flight guard: each duplicate send is billed
    ) {
      return;
    }
    resendingRef.current = true;
    setResending(true);
    try {
      await sendOtp({ phone });
      if (currentStatus() === "awaitingCode") {
        toast.success("Code renvoyé par SMS.");
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : NETWORK_ERROR);
    } finally {
      resendingRef.current = false;
      setResending(false);
    }
  }, [resendCooldown, sendOtp, currentStatus]);

  const finalize = useCallback(async () => {
    if (currentStatus() !== "verified") return;
    await runFinalize();
  }, [currentStatus, runFinalize]);

  return {
    status,
    // "verified" stays visible: the step shows a finalizing spinner (or the
    // retry button) until the form's own success screen takes over.
    stepVisible:
      status === "sending" ||
      status === "awaitingCode" ||
      status === "verifying" ||
      status === "verified",
    code,
    setCode,
    resendCooldown,
    resending,
    finalizeFailed,
    start,
    verify,
    resend,
    finalize,
  };
}
