"use client";

import { useState } from "react";
import { Award, Phone, Star } from "lucide-react";
import { CallbackFormModal } from "@repo/ui";

const testimonials = [
  {
    name: "Marie L.",
    location: "Résidente GreenCity — Toulouse",
    quote:
      "La qualité des finitions GreenCity nous a convaincus. Le jardin commun est un vrai plus pour notre famille, les enfants adorent.",
    rating: 5,
  },
  {
    name: "Pierre & Anne V.",
    location: "Propriétaires — Toulouse Nord",
    quote:
      "L'emplacement proche du métro B et des espaces verts était exactement ce que nous recherchions. Un quartier en pleine transformation.",
    rating: 5,
  },
  {
    name: "Julien M.",
    location: "Investisseur — T3",
    quote:
      "GreenCity propose un excellent rapport qualité-prix. Les certifications NF Habitat et RE 2020 rassurent pour un investissement à long terme.",
    rating: 5,
  },
];

export function Reassurance() {
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <div className="py-20 bg-light">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Promoteurs */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Un promoteur de confiance
          </h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            GreenCity Immobilier, en partenariat avec Acte-S Promotion :
            28 Pyramides d&apos;or et d&apos;argent depuis 2011, avec une exigence
            constante de qualité, d&apos;innovation et de durabilité.
          </p>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap justify-center gap-6 mb-14">
          {["NF Habitat", "RE 2020 seuil 2025", "Toulouse Métropole"].map((label) => (
            <div
              key={label}
              className="bg-white rounded-xl px-6 py-4 shadow-sm flex items-center gap-3"
            >
              <Award className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Témoignages */}
        <h3 className="text-2xl font-bold text-foreground text-center mb-8">
          Ils nous font confiance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-foreground/85 text-sm leading-relaxed mb-4 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted">{t.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setCallbackOpen(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-lg transition cursor-pointer text-lg"
          >
            <Phone className="w-5 h-5" />
            Être rappelé
          </button>
        </div>
      </div>

      <CallbackFormModal
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
      />
    </div>
  );
}
