"use client";

import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

export function Residence() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <AnimateOnScroll>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-sauge-very-dark md:text-4xl">
              Un cadre de vie pensé pour votre bien-être
            </h2>
            <p className="leading-relaxed text-gray-600">
              Composée de deux bâtiments aux lignes contemporaines, Park View 2
              propose 74 logements du T2 au T5. Tous les appartements disposent
              d'un espace extérieur (loggia ou terrasse). Au cœur de la
              résidence, un cœur d'îlot paysager offre un espace de
              convivialité.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-6 md:grid-cols-2">
          <AnimateOnScroll>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/Empalot_Park_View_Interieur_Web.jpg"
                alt="Intérieur d'un appartement Park View 2"
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/Empalot_Park_View_Terrasse_Web.jpg"
                alt="Terrasse d'un appartement Park View 2"
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll>
          <div className="mt-10 text-center">
            <button
              onClick={scrollToContact}
              className="inline-flex cursor-pointer items-center rounded-full bg-ocre px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-ocre-dark hover:scale-105"
            >
              Découvrir les disponibilités
            </button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
