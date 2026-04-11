"use client";

import { useState } from "react";
import { TrainFront, Leaf, Trees, Maximize, Phone } from "lucide-react";
import { CallbackFormModal } from "@repo/ui";

const advantages = [
  {
    icon: TrainFront,
    title: "Proximité & accessibilité",
    description:
      "À deux pas du métro Aerospace Campus, au cœur du quartier innovant de Montaudran. Accès rapide au centre-ville et aux grands axes.",
  },
  {
    icon: Leaf,
    title: "Habitat durable",
    description:
      "Certification NF Habitat HQE et conformité RE 2020 seuil 2025 pour des performances énergétiques optimales et un confort toute l'année.",
  },
  {
    icon: Trees,
    title: "Nature et convivialité",
    description:
      "Coursives végétalisées, jardin commun paysagé et salle de sport. Un cadre de vie pensé pour le bien‑être au quotidien.",
  },
  {
    icon: Maximize,
    title: "Volumes généreux",
    description:
      "Appartements fonctionnels et lumineux du T2 au T5, tous dotés d'un balcon ou d'une terrasse pour profiter de l'extérieur.",
  },
];

export function Advantages() {
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <div className="bg-light py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Pourquoi choisir Home Spirit 2 ?
          </h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            Un programme pensé pour conjuguer confort, durabilité et emplacement d&apos;exception.
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
