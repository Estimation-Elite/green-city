"use client";

import { useState } from "react";
import { OtpVerificationStep, usePhoneOtp } from "@repo/ui";
import { trackLeadSubmitted } from "@repo/core/analytics/trackLeadSubmitted";
import { trackBrochureDownloaded } from "@repo/core/analytics/trackBrochureDownloaded";
import { trackPhoneVerified } from "@repo/core/analytics/trackPhoneVerified";

const PDF_URL = "/documents/HomeSpirit2-Brochure.pdf";

function triggerPdfDownload() {
  const link = document.createElement("a");
  link.href = PDF_URL;
  link.download = "HomeSpirit2-Brochure.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  trackBrochureDownloaded();
}

interface LeadFormProps {
  variant?: "light" | "dark";
  buttonLabel?: string;
  className?: string;
}

export function LeadForm({
  variant = "light",
  buttonLabel = "Être rappelé(e)",
  className = "",
}: LeadFormProps) {
  const [form, setForm] = useState({ nom: "", telephone: "", email: "" });
  const [succeeded, setSucceeded] = useState(false);

  // Runs only AFTER the phone has been verified by SMS (usePhoneOtp calls it
  // as onVerified). Throws on failure so the hook can toast + offer a retry.
  const submitLead = async () => {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(
        result?.error ?? "Une erreur est survenue. Veuillez réessayer.",
      );
    }
    if (result?.leadId) {
      trackLeadSubmitted(result.leadId);
      trackPhoneVerified(result.leadId);
    }
    setSucceeded(true);
  };

  const otp = usePhoneOtp({ onVerified: submitLead });

  // MMB timing: submit triggers the SMS verification; the lead is only
  // posted (submitLead) once the code is validated. A send failure (invalid
  // number, landline...) is toasted by the hook and returns to the form.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await otp.start({ phone: form.telephone.trim() });
  };

  const isDark = variant === "dark";

  const inputClasses = isDark
    ? "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
    : "w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary";

  if (succeeded) {
    return (
      <div className={`rounded-xl p-6 text-center ${isDark ? "bg-white/10" : "bg-green-50"} ${className}`}>
        <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-green-700"}`}>
          Merci ! Un conseiller vous recontacte sous 24h.
        </p>
        <button
          onClick={triggerPdfDownload}
          className={`mt-4 w-full bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer`}
        >
          Télécharger la brochure
        </button>
      </div>
    );
  }

  // OTP step (phone verification gates the lead submission)
  if (otp.stepVisible) {
    return (
      <div className={`rounded-xl p-6 ${isDark ? "bg-white/10" : "bg-green-50"} ${className}`}>
        <OtpVerificationStep
          phone={form.telephone}
          otp={otp}
          tone={isDark ? "dark" : "light"}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <input
        type="text"
        placeholder="Votre nom"
        required
        value={form.nom}
        onChange={(e) => setForm({ ...form, nom: e.target.value })}
        className={inputClasses}
      />
      <input
        type="tel"
        placeholder="Votre téléphone"
        required
        value={form.telephone}
        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
        className={inputClasses}
      />
      <input
        type="email"
        placeholder="Votre email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={inputClasses}
      />
      <button
        type="submit"
        className="w-full bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
