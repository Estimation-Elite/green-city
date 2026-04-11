"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { CallbackFormModal } from "@repo/ui";
import { LeadForm } from "@/components/ui/LeadForm";
import { LiveViewerCount } from "@/components/ui/LiveViewerCount";
import { LotsAvailableBadge } from "@/components/ui/LotsAvailableBadge";
import { socialProofData } from "@/data/home-spirit";

export function Hero() {
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Background image */}
      <Image
        src="/images/HomeSpirit2_VueIlot_01.jpg"
        alt="Home Spirit 2 — Vue d'ensemble de la résidence à Toulouse Montaudran"
        fill
        className="object-cover"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-dark/40" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Texte */}
          <div className="flex-1 text-white space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block bg-accent text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                Toulouse Aerospace — Montaudran
              </span>
              <LotsAvailableBadge count={socialProofData.lotsAvailable} variant="accent" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Home Spirit 2 :<br />
              votre résidence lumineuse à{" "}
              <span className="text-accent">Toulouse Montaudran</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed">
              79 appartements du T2 au T5 avec balcon ou terrasse, au cœur d&apos;un
              quartier innovant. Architecture contemporaine aux balcons arrondis,
              à proximité immédiate du métro Aerospace Campus.
            </p>

            {/* Stats */}
            <div className="flex gap-8 pt-2">
              {[
                { value: "79", label: "Appartements" },
                { value: "T2–T5", label: "Typologies" },
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

            <LiveViewerCount variant="dark" />

            {/* Boutons de segmentation */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#habiter"
                className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-primary-light transition"
              >
                Je veux habiter
              </a>
              <button
                onClick={() => setCallbackOpen(true)}
                className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Être rappelé
              </button>
            </div>
          </div>

          {/* Formulaire rapide */}
          <div className="w-full lg:w-[400px] bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-white text-lg font-bold mb-1">
              Recevez votre documentation
            </h2>
            <p className="text-white/70 text-sm mb-4">
              Un conseiller vous rappelle sous 24h
            </p>
            <LeadForm variant="dark" buttonLabel="Être rappelé(e)" />
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
