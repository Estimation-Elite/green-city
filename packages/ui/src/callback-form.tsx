"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Check, Calendar, Clock, Mail, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { CustomCalendar } from "./custom-calendar";
import { useUtmParams } from "./hooks/useUtmParams";
import { trackLeadSubmitted } from "@repo/core/analytics/trackLeadSubmitted";
import { trackCallbackScheduled } from "@repo/core/analytics/trackCallbackScheduled";

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface CallbackFormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  appointmentDate: Date | undefined;
  appointmentTime: string | null;
  message: string;
}

interface CallbackFormProps {
  residenceRef?: string;
  onSuccess?: () => void;
  className?: string;
}

// ────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────

const TOTAL_STEPS = 3;

const TIME_SLOTS = [
  "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
  "20:00",
];

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────

function CallbackForm({
  residenceRef,
  onSuccess,
  className = "",
}: CallbackFormProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const utmParams = useUtmParams();

  const [form, setForm] = useState<CallbackFormData>({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    appointmentDate: undefined,
    appointmentTime: null,
    message: "",
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
      case 2: return form.appointmentDate !== undefined && form.appointmentTime !== null;
      case 3: return true; // Message is optional
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/rdv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            firstName: form.prenom.trim(),
            name: form.nom.trim(),
            email: form.email.trim(),
            phone: form.telephone.trim(),
          },
          appointmentDate: form.appointmentDate?.toISOString() ?? null,
          appointmentTime: form.appointmentTime,
          message: form.message.trim() || undefined,
          residenceRef,
          utmSource: utmParams.utm_source,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi.");
      }

      if (result.leadId) {
        trackLeadSubmitted(result.leadId);
        trackCallbackScheduled(result.leadId);
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

  // ── Success screen ──
  if (submitted) {
    const formattedDate = form.appointmentDate
      ? format(form.appointmentDate, "EEEE d MMMM yyyy", { locale: fr })
      : "";

    return (
      <div className={`text-center space-y-6 py-8 ${className}`}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            Rendez-vous confirmé !
          </h3>
          <p className="text-muted mt-2 text-sm">
            Un conseiller vous rappellera le{" "}
            <strong className="text-foreground">{formattedDate}</strong> à{" "}
            <strong className="text-foreground">{form.appointmentTime}</strong>.
          </p>
        </div>
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

  // ── Step 1: Identity (all contact fields on one page) ──
  const renderIdentityStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Vos coordonnées</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Prénom</label>
          <Input
            type="text"
            placeholder="Votre prénom"
            value={form.prenom}
            onChange={(e) => setForm((prev) => ({ ...prev, prenom: e.target.value }))}
            className="h-12 text-base"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Nom</label>
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
        <label className="text-sm font-medium text-foreground">Email</label>
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
        <label className="text-sm font-medium text-foreground">Téléphone</label>
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

  // ── Step 2: Date + Time ──
  const renderDateTimeStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">
        {!form.appointmentDate
          ? "Choisissez une date de rappel"
          : !form.appointmentTime
            ? `${format(form.appointmentDate, "EEEE d MMMM", { locale: fr })} — Choisissez une heure`
            : "Date et heure sélectionnées"}
      </h3>

      {!form.appointmentDate ? (
        <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
          <CustomCalendar
            selected={form.appointmentDate}
            onSelect={(date) => {
              setForm((prev) => ({ ...prev, appointmentDate: date, appointmentTime: null }));
            }}
            locale={fr}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date <= today || date.getDay() === 0 || date.getDay() === 6;
            }}
          />
        </div>
      ) : !form.appointmentTime ? (
        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              onClick={() => {
                setForm((prev) => ({ ...prev, appointmentTime: time }));
              }}
              className="w-full p-3 rounded-xl text-center font-medium bg-white border border-gray-200 hover:border-accent/50 hover:bg-accent/5 text-foreground transition-all"
            >
              <Clock className="w-4 h-4 inline-block mr-2 opacity-50" />
              {time}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center gap-4">
          <Calendar className="w-6 h-6 text-accent" />
          <div>
            <p className="font-semibold text-foreground">
              {format(form.appointmentDate, "EEEE d MMMM yyyy", { locale: fr })}
            </p>
            <p className="text-sm text-muted">à {form.appointmentTime}</p>
          </div>
          <button
            onClick={() => setForm((prev) => ({ ...prev, appointmentDate: undefined, appointmentTime: null }))}
            className="ml-auto text-sm text-accent hover:underline"
          >
            Modifier
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => {
          if (form.appointmentTime) {
            setForm((prev) => ({ ...prev, appointmentTime: null }));
          } else if (form.appointmentDate) {
            setForm((prev) => ({ ...prev, appointmentDate: undefined }));
          } else {
            handleBack();
          }
        }} className="h-12">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        {form.appointmentDate && form.appointmentTime && (
          <Button
            onClick={handleNext}
            className="flex-1 h-12 bg-accent hover:bg-accent-dark text-white"
          >
            Suivant
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );

  // ── Step 3: Message ──
  const renderMessageStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">
        Un message à nous transmettre ? <span className="text-muted font-normal text-sm">(optionnel)</span>
      </h3>
      <Textarea
        placeholder="Précisez votre demande, vos questions..."
        value={form.message}
        onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
        rows={4}
        className="text-base"
        autoFocus
      />
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="h-12">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 h-12 bg-accent hover:bg-accent-dark text-white"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Confirmer le rendez-vous"
          )}
        </Button>
      </div>
    </div>
  );

  // ── Step content ──
  const getStepContent = () => {
    switch (step) {
      case 1:
        return renderIdentityStep();
      case 2:
        return renderDateTimeStep();
      case 3:
        return renderMessageStep();
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

export { CallbackForm, type CallbackFormProps };
