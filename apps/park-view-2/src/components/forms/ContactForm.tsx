"use client";

import { useState } from "react";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Textarea } from "@repo/ui";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

type FormData = {
  civilite: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  codePostal: string;
  projetType: string;
  message: string;
  rgpd: boolean;
};

const initialFormData: FormData = {
  civilite: "M.",
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  codePostal: "",
  projetType: "Résidence principale",
  message: "",
  rgpd: false,
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const utm = {
    utm_source: searchParams.get("utm_source") ?? undefined,
    utm_medium: searchParams.get("utm_medium") ?? undefined,
    utm_campaign: searchParams.get("utm_campaign") ?? undefined,
  };

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.rgpd) {
      toast.error("Veuillez accepter la politique de confidentialité.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      setSubmitted(true);
      setFormData(initialFormData);
      toast.success("Votre demande a bien été envoyée !");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-sauge/20 bg-sauge/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sauge/10">
          <svg
            className="h-8 w-8 text-sauge"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-sauge-very-dark">
          Merci pour votre demande !
        </h3>
        <p className="text-gray-600">
          Nous vous enverrons la plaquette et les disponibilités dans les plus
          brefs délais.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 cursor-pointer text-sm font-medium text-sauge underline-offset-4 hover:underline"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Civilité */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-gray-700">
          Civilité
        </legend>
        <div className="flex gap-4">
          {["M.", "Mme"].map((c) => (
            <label
              key={c}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name="civilite"
                value={c}
                checked={formData.civilite === c}
                onChange={() => update("civilite", c)}
                className="accent-sauge"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Prénom / Nom */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            required
            value={formData.prenom}
            onChange={(e) => update("prenom", e.target.value)}
            placeholder="Jean"
          />
        </div>
        <div>
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            required
            value={formData.nom}
            onChange={(e) => update("nom", e.target.value)}
            placeholder="Dupont"
          />
        </div>
      </div>

      {/* Email / Téléphone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jean.dupont@email.com"
          />
        </div>
        <div>
          <Label htmlFor="telephone">Téléphone *</Label>
          <Input
            id="telephone"
            type="tel"
            required
            pattern="[0-9\s\-\(\)\+]{10,}"
            value={formData.telephone}
            onChange={(e) => update("telephone", e.target.value)}
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      {/* Code postal / Projet */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="codePostal">Code postal</Label>
          <Input
            id="codePostal"
            value={formData.codePostal}
            onChange={(e) => update("codePostal", e.target.value)}
            placeholder="31400"
          />
        </div>
        <div>
          <Label htmlFor="projetType">Votre projet</Label>
          <select
            id="projetType"
            value={formData.projetType}
            onChange={(e) => update("projetType", e.target.value)}
            className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sauge focus:outline-none focus:ring-1 focus:ring-sauge"
          >
            <option>Résidence principale</option>
            <option>Investissement locatif</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="message">Message (optionnel)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Précisez votre demande..."
        />
      </div>

      {/* RGPD */}
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          required
          checked={formData.rgpd}
          onChange={(e) => update("rgpd", e.target.checked)}
          className="mt-0.5 accent-sauge"
        />
        <span className="text-gray-600">
          J'accepte que mes données soient traitées dans le cadre de ma demande
          d'information conformément à la{" "}
          <a
            href="/mentions-legales"
            className="text-sauge underline-offset-2 hover:underline"
          >
            politique de confidentialité
          </a>
          . *
        </span>
      </label>

      {/* Submit */}
      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full cursor-pointer rounded-full bg-sauge text-base font-semibold text-white shadow-lg transition hover:bg-sauge-dark hover:scale-[1.02] disabled:opacity-60"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Envoi en cours...
          </span>
        ) : (
          "Recevoir ma plaquette gratuite"
        )}
      </Button>
    </form>
  );
}
