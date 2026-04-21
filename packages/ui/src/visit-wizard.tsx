"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { CustomCalendar } from "./custom-calendar";
import { ArrowLeft, Mail, Phone, Loader2 } from "lucide-react";
import { useUtmParams } from "./hooks/useUtmParams";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { trackVisitScheduled } from "@repo/core/analytics/trackVisitScheduled";

export interface VisitFormData {
  contact: {
    firstName: string;
    name: string;
    email: string;
    phone: string;
  };
  appointmentDate: Date | undefined;
  appointmentTime: string | null;
}

export interface VisitWizardProps {
  projectName: string;
  projectAddress: string;
  createVisit?: (
    data: VisitFormData,
    projectAddress: string,
    utmSource?: string,
  ) => Promise<string | undefined>;
}

const getInitialFormData = (): VisitFormData => ({
  contact: {
    firstName: "",
    name: "",
    email: "",
    phone: "",
  },
  appointmentDate: undefined,
  appointmentTime: null,
});

const defaultCreateVisit = async (
  formData: VisitFormData,
  projectAddress: string,
  utmSource?: string,
) => {
  const response = await fetch("/api/rdv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...formData,
      appointmentDate: formData.appointmentDate?.toISOString() ?? null,
      projectAddress,
      utmSource,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de créer le rendez-vous.");
  }

  return data.leadId;
};

export function VisitWizard({
  projectName,
  projectAddress,
  createVisit = defaultCreateVisit,
}: VisitWizardProps) {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4; // Date, Time, Contact, Confirmation
  const utmParams = useUtmParams();

  const [formData, setFormData] =
    useState<VisitFormData>(getInitialFormData);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (step === TOTAL_STEPS && !hasSubmitted) {
      setHasSubmitted(true);
    }
  }, [step, hasSubmitted]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (key: keyof VisitFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateContact = (
    key: keyof VisitFormData["contact"],
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [key]: value },
    }));
  };

  const isContactValid = () => {
    return (
      formData.contact.name.length > 2 &&
      formData.contact.email.includes("@") &&
      formData.contact.phone.length >= 10
    );
  };

  const handleCreateVisit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const leadId = await createVisit(
        formData,
        projectAddress,
        utmParams.utm_source,
      );
      toast.success("Rendez-vous enregistré !");
      if (leadId) {
        trackVisitScheduled(leadId);
      }
      setStep(TOTAL_STEPS);
    } catch (error) {
      console.error("Error creating visit:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors de la création du rendez-vous.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep_Date = () => (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 text-center">
          Choisissez une date
        </h3>
      </div>
      <div className="p-6 flex justify-center">
        <CustomCalendar
          selected={formData.appointmentDate}
          onSelect={(date) => {
            updateFormData("appointmentDate", date);
            if (date) handleNext();
          }}
          locale={fr}
          className="border-0"
          disabled={(date) => {
            const today = new Date();
            const minDate = new Date(today);
            minDate.setDate(today.getDate() + 3);
            minDate.setHours(0, 0, 0, 0);
            return date < minDate || date.getDay() === 0 || date.getDay() === 6;
          }}
        />
      </div>
    </div>
  );

  const renderStep_Time = () => {
    const timeSlots = [
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
    ];

    return (
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 -ml-2 z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="flex-1 text-lg font-bold text-gray-900 text-center -ml-9">
            {formData.appointmentDate &&
              format(formData.appointmentDate, "EEEE d MMMM", { locale: fr })}
          </h3>
        </div>
        <div className="p-6 space-y-3">
          <h4 className="text-base font-semibold text-gray-900 mb-4">
            Choisissez une heure
          </h4>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  updateFormData("appointmentTime", time);
                  handleNext();
                }}
                className={`w-full p-4 rounded-lg transition-all text-center font-medium ${formData.appointmentTime === time
                  ? "bg-brand-primary/20 text-brand-primary border border-brand-primary"
                  : "bg-brand-primary/5 text-gray-900 hover:bg-brand-primary/10 border border-transparent"
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep_Contact = () => (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 -ml-2  z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center -ml-9">
          <h3 className="text-lg font-bold text-gray-900">
            {formData.appointmentDate &&
              format(formData.appointmentDate, "EEEE d MMMM", { locale: fr })}
          </h3>
          <p className="text-sm font-semibold text-gray-900">
            {formData.appointmentTime}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Prénom</label>
          <Input
            placeholder="Entrez votre prénom"
            value={formData.contact.firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateContact("firstName", e.target.value)
            }
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Nom</label>
          <Input
            placeholder="Entrez votre nom"
            value={formData.contact.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateContact("name", e.target.value)
            }
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Entrez votre adresse email"
              value={formData.contact.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateContact("email", e.target.value)
              }
              className="h-12 text-base pl-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">
            Numéro de téléphone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="tel"
              placeholder="Entrez votre numéro"
              value={formData.contact.phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateContact("phone", e.target.value)
              }
              className="h-12 text-base pl-11"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-8 h-12 text-base"
          >
            Retour
          </Button>
          <Button
            onClick={handleCreateVisit}
            disabled={!isContactValid() || submitting}
            className="px-12 h-12 text-base"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              "Confirmer le rendez-vous"
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep_Confirmation = () => {
    const formattedDate = formData.appointmentDate
      ? format(formData.appointmentDate, "EEEE d MMMM yyyy", { locale: fr })
      : "";

    return (
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Confirmation de votre rendez-vous
        </h3>

        <div className="space-y-6 text-gray-900">
          <p>
            Votre demande de visite du programme{" "}
            <span className="font-semibold">{projectName}</span> a bien été
            prise en compte.
          </p>

          <div className="space-y-2">
            <p>
              <span className="font-bold">Date :</span> Le {formattedDate} à{" "}
              {formData.appointmentTime}
            </p>
            <p>
              <span className="font-bold">Lieu :</span> {projectAddress}
            </p>
            <p>
              <span className="font-bold">Contact :</span>{" "}
              {formData.contact.phone}
            </p>
          </div>

          <p>
            Nous allons vous contacter dans les meilleurs délais pour confirmer
            ce rendez-vous.
          </p>
        </div>
      </div>
    );
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return renderStep_Date();
      case 2:
        return renderStep_Time();
      case 3:
        return renderStep_Contact();
      case 4:
        return renderStep_Confirmation();
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
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
