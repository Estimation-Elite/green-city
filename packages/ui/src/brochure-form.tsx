"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Download, Loader2, Check, Mail, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "./input";
import { Button } from "./button";
import { useUtmParams } from "./hooks/useUtmParams";
import { trackLeadSubmitted } from "@repo/core/analytics/trackLeadSubmitted";
import { trackBrochureDownloaded } from "@repo/core/analytics/trackBrochureDownloaded";

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface BrochureFormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  objectif: "HABITER" | "INVESTIR" | null;
  purchaseTime: "IMMEDIAT" | "6_MOIS" | "INDEFINI" | null;
  financingValidation: "OUI" | "NON" | "EN_COURS" | null;
}

interface BrochureFormProps {
  pdfUrl: string;
  pdfFilename: string;
  residenceId?: string;
  onSuccess?: () => void;
  className?: string;
}

// ────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────

const TOTAL_STEPS = 4;

const OBJECTIF_OPTIONS = [
  { value: "HABITER" as const, label: "Habiter", description: "Résidence principale" },
  { value: "INVESTIR" as const, label: "Investir", description: "Investissement locatif" },
];

const PURCHASE_TIME_OPTIONS = [
  { value: "IMMEDIAT" as const, label: "Immédiat", description: "Je suis prêt à acheter" },
  { value: "6_MOIS" as const, label: "Dans les 6 prochains mois", description: "Je me projette bientôt" },
  { value: "INDEFINI" as const, label: "Pas de date définie", description: "Je m'informe" },
];

const FINANCING_OPTIONS = [
  { value: "OUI" as const, label: "Oui", description: "Mon financement est validé" },
  { value: "NON" as const, label: "Non", description: "Pas encore de démarche" },
  { value: "EN_COURS" as const, label: "En cours", description: "Dossier en traitement" },
];

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────

function BrochureForm({
  pdfUrl,
  pdfFilename,
  residenceId,
  onSuccess,
  className = "",
}: BrochureFormProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const utmParams = useUtmParams();

  const [form, setForm] = useState<BrochureFormData>({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    objectif: null,
    purchaseTime: null,
    financingValidation: null,
  });

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isIdentityValid = (): boolean => {
    return (
      form.prenom.trim().length > 1 &&
      form.nom.trim().length > 1 &&
      form.email.includes("@") &&
      form.email.includes(".") &&
      form.telephone.replace(/\s/g, "").length >= 10
    );
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 1: return isIdentityValid();
      case 2: return form.objectif !== null;
      case 3: return form.purchaseTime !== null;
      case 4: return form.financingValidation !== null;
      default: return false;
    }
  };

  const handleSelectAndAdvance = <K extends keyof BrochureFormData>(
    key: K,
    value: BrochureFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (step < TOTAL_STEPS) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      // Last step - auto-submit after selection
      setForm((prev) => {
        const updated = { ...prev, [key]: value };
        setTimeout(() => {
          handleSubmitWithData(updated);
        }, 200);
        return updated;
      });
    }
  };

  const handleSubmitWithData = async (data: BrochureFormData) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: data.prenom.trim(),
          nom: data.nom.trim(),
          email: data.email.trim(),
          telephone: data.telephone.trim(),
          objectif: data.objectif,
          purchaseTime: data.purchaseTime,
          financingValidation: data.financingValidation,
          formType: "brochure",
          utmSource: utmParams.utm_source,
          residenceId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi.");
      }

      if (result.leadId) {
        trackLeadSubmitted(result.leadId);
      }

      setSubmitted(true);
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inattendue.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const triggerPdfDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    trackBrochureDownloaded();
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <div className={`text-center space-y-6 py-8 ${className}`}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold">
            Merci ! Un conseiller vous recontacte sous 24h.
          </h3>
          <p className="mt-2 text-sm">
            Téléchargez votre brochure dès maintenant.
          </p>
        </div>
        <Button
          onClick={triggerPdfDownload}
          size="lg"
          className="w-full max-w-sm mx-auto bg-accent hover:bg-accent-dark text-white"
        >
          <Download className="w-5 h-5 mr-2" />
          Télécharger la brochure
        </Button>
      </div>
    );
  }

  // ── Progress bar ──
  const progressBar = (
    <div className="flex items-center gap-1.5 mb-6">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < step ? "bg-accent" : "bg-gray-200"
            }`}
        />
      ))}
    </div>
  );

  const stepLabel = (
    <p className="text-xs text-muted mb-4">
      Étape {step} sur {TOTAL_STEPS}
    </p>
  );

  // ── Identity step (all contact fields on one page) ──
  const renderIdentityStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Vos coordonnées</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Prénom</label>
          <Input
            type="text"
            placeholder="Votre prénom"
            value={form.prenom}
            onChange={(e) => setForm((prev) => ({ ...prev, prenom: e.target.value }))}
            className="h-12 text-base"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Nom</label>
          <Input
            type="text"
            placeholder="Votre nom"
            value={form.nom}
            onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
            className="h-12 text-base"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="email"
            placeholder="votre@email.com"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="h-12 text-base pl-11"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Téléphone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="tel"
            placeholder="06 XX XX XX XX"
            value={form.telephone}
            onChange={(e) => setForm((prev) => ({ ...prev, telephone: e.target.value }))}
            className="h-12 text-base pl-11"
          />
        </div>
      </div>
      <Button
        onClick={handleNext}
        disabled={!isStepValid()}
        className="w-full h-12 bg-accent hover:bg-accent-dark text-white"
      >
        Suivant
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  // ── Radio step renderer ──
  const renderRadioStep = <T extends string>(
    label: string,
    options: { value: T; label: string; description: string }[],
    field: keyof BrochureFormData,
    currentValue: T | null,
  ) => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{label}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelectAndAdvance(field, option.value as BrochureFormData[typeof field])}
            className={`w-full p-4 rounded-xl text-left transition-all border cursor-pointer ${currentValue === option.value
              ? "bg-white/80 border-accent border-2 text-foreground"
              : "bg-white border-gray-200 hover:border-accent/50 hover:bg-white/80 text-foreground"
              }`}
          >
            <span className="font-semibold block">{option.label}</span>
            <span className="text-sm text-muted">{option.description}</span>
          </button>
        ))}
      </div>
      <Button variant="outline" onClick={handleBack} className="h-10">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>
    </div>
  );

  // ── Step content ──
  const getStepContent = () => {
    switch (step) {
      case 1:
        return renderIdentityStep();
      case 2:
        return renderRadioStep("Quel est votre objectif ?", OBJECTIF_OPTIONS, "objectif", form.objectif);
      case 3:
        return renderRadioStep("Quel est votre horizon d'achat ?", PURCHASE_TIME_OPTIONS, "purchaseTime", form.purchaseTime);
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">
              Avez-vous déjà validé un financement ?
            </h3>
            <div className="space-y-2">
              {FINANCING_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  disabled={submitting}
                  onClick={() => handleSelectAndAdvance("financingValidation", option.value)}
                  className={`w-full p-4 rounded-xl text-left transition-all border cursor-pointer ${form.financingValidation === option.value
                    ? "bg-white/80 border-accent border-2 text-foreground"
                    : "bg-white border-gray-200 hover:border-accent/50 hover:bg-white/80 text-foreground"
                    }`}
                >
                  <span className="font-semibold block">{option.label}</span>
                  <span className="text-sm text-muted">{option.description}</span>
                </button>
              ))}
            </div>
            {submitting && (
              <div className="flex items-center justify-center gap-2 text-muted py-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Envoi en cours...</span>
              </div>
            )}
            <Button variant="outline" onClick={handleBack} className="h-10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {progressBar}
      {stepLabel}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {getStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export { BrochureForm, type BrochureFormProps };
