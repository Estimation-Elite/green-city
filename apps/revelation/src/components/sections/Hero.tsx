"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { CallbackFormModal } from "@repo/ui";
import { availableLots } from "@/data/revelation";

export function Hero() {
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Background image */}
      <Image
        src="/images/RtedeRevel_VueTerrasse.jpg"
        alt="Révélation — Vue d'ensemble de la résidence au Faubourg Malepère, Toulouse"
        fill
        className="object-cover"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-dark/40" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
        <div className="max-w-2xl text-white space-y-6">
          <span className="inline-block bg-accent text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            Toulouse — Faubourg Malepère
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Révélation :<br />
            votre résidence nature à{" "}
            <span className="text-accent">Toulouse Malepère</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed">
            168 appartements du T1 au T5 au cœur de l&apos;écoquartier Faubourg
            Malepère. Architecture contemporaine inspirée de la brique rose
            toulousaine, dans un grand parc boisé.
          </p>

          {/* Stats */}
          <div className="flex gap-8 pt-2">
            {[
              { value: "168", label: "Appartements" },
              { value: "T1–T5", label: "Typologies" },
              { value: "100 %", label: "Avec extérieur" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-accent">{stat.value}</div>
                <div className="text-xs text-white/70 uppercase tracking-wide mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Lots disponibles */}
          <p className="text-accent font-semibold text-lg">
            Plus que {availableLots} disponibles
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#contact"
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition text-lg"
            >
              Je veux télécharger la plaquette
            </a>
            <button
              onClick={() => setCallbackOpen(true)}
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition text-lg cursor-pointer"
            >
              <Phone className="w-5 h-5" />
              Être rappelé
            </button>
          </div>
        </div>
      </div>

      <CallbackFormModal
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
      />
    </div>
  );
}
