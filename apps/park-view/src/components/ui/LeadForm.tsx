"use client";

import { useState } from "react";
import { trackLeadSubmitted } from "@repo/core/analytics/trackLeadSubmitted";
import { trackBrochureDownloaded } from "@repo/core/analytics/trackBrochureDownloaded";

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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.leadId) {
          trackLeadSubmitted(result.leadId);
        }
        setStatus("success");
        setForm({ nom: "", telephone: "", email: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const isDark = variant === "dark";

  const inputClasses = isDark
    ? "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
    : "w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary";

  if (status === "success") {
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
        disabled={status === "loading"}
        className="w-full bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer disabled:opacity-60"
      >
        {status === "loading" ? "Envoi en cours..." : buttonLabel}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}
    </form>
  );
}
