"use client";

import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blanc-casse via-sable-light/40 to-blanc-casse">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
        <AnimateOnScroll>
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center rounded-full bg-ocre/15 px-4 py-1.5 text-sm font-semibold text-ocre-dark">
              TVA 5,5% possible
            </span>
            <h1 className="text-4xl font-bold leading-tight text-sauge-very-dark md:text-5xl lg:text-6xl">
              Park View 2
              <span className="block text-sauge">Toulouse Empalot</span>
            </h1>
            <p className="max-w-lg text-lg text-gray-600">
              74 logements neufs du T2 au T5, à 1 min du métro ligne B
            </p>
            <button
              onClick={scrollToContact}
              className="inline-flex w-fit cursor-pointer items-center rounded-full bg-sauge px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-sauge-dark hover:scale-105"
            >
              Recevoir la plaquette
            </button>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.2}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/images/Empalot_Park_View_Vue02_Web.jpg"
              alt="Park View 2 — Vue extérieure de la résidence à Toulouse Empalot"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
