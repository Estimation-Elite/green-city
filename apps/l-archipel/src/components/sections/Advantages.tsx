"use client";

import { useState } from "react";
import { TrainFront, Leaf, Trees, Maximize, Phone } from "lucide-react";
import { CallbackFormModal } from "@repo/ui";

const advantages = [
  {
    icon: TrainFront,
    title: "Transports à portée de main",
    description:
      "À 250m de l'arrêt Trois Cocus (Métro B) et 600m de Borderouge. Future ligne C du métro et gare La Vache à 1,5 km (horizon 2028).",
  },
  {
    icon: Leaf,
    title: "Habitat certifié",
    description:
      "Certification NF Habitat (Bureau Veritas) et conformité RE 2020 seuil 2025 pour des performances énergétiques et un confort optimal.",
  },
  {
    icon: Trees,
    title: "Un jardin au cœur de la résidence",
    description:
      "Un jardin central paysagé entre les 2 bâtiments, pensé pour la biodiversité et la circulation douce. Parc de la Maourine à 1 km.",
  },
  {
    icon: Maximize,
    title: "Des prestations soignées",
    description:
      "Terrasses en bois, cuisines équipées (T2 & T3), placards aménagés, vidéophone connecté smartphone et menuiseries PVC double vitrage.",
  },
];

export function Advantages() {
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <div className="bg-light py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Pourquoi choisir L&apos;Archipel ?
          </h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            Un programme pensé pour conjuguer confort, nature en ville et accessibilité dans le nord de Toulouse.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
            >
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition">
                <item.icon className="w-6 h-6 text-primary group-hover:text-white transition" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
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
