"use client";

import { useState } from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { ChevronDown } from "lucide-react";

const dispositifs = [
  {
    id: "tva",
    title: "TVA réduite 5,5%",
    content: [
      "Acheter un logement neuf à prix inférieur au marché",
      "Résidence principale, sous conditions de ressources",
      "Cumulable avec le PTZ (Prêt à Taux Zéro)",
    ],
  },
  {
    id: "jeanbrun",
    title: "Dispositif Jeanbrun",
    content: [
      "Investissement locatif avec déduction fiscale",
      "Amortissement du bien, baisse d'impôt sur le revenu",
      "Location à loyer plafonné, engagement 9 ans minimum",
    ],
  },
  {
    id: "lli",
    title: "LLI (Logement Locatif Intermédiaire)",
    content: [
      "TVA réduite à 10%, soit -10% sur le prix de marché",
      "Pas de taxe foncière jusqu'à 20 ans",
      "Acquisition via SCI (IR ou IS)",
      "Engagement de location 16 ans minimum",
    ],
  },
];

export function Dispositifs() {
  const [openItem, setOpenItem] = useState<string | null>("tva");

  function toggle(id: string) {
    setOpenItem((prev) => (prev === id ? null : id));
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <AnimateOnScroll>
          <h2 className="mb-4 text-center text-3xl font-bold text-sauge-very-dark md:text-4xl">
            Dispositifs financiers
          </h2>
          <p className="mb-12 text-center text-gray-600">
            Plusieurs solutions pour financer votre projet immobilier
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
            {dispositifs.map((d) => (
              <div key={d.id}>
                <button
                  type="button"
                  onClick={() => toggle(d.id)}
                  className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left text-base font-semibold text-sauge-very-dark transition hover:bg-gray-50"
                >
                  {d.title}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${openItem === d.id ? "rotate-180" : ""}`}
                  />
                </button>
                {openItem === d.id && (
                  <div className="px-5 pb-4">
                    <ul className="space-y-2 py-2">
                      {d.content.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ocre" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
