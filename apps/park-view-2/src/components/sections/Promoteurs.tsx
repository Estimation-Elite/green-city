import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const promoteurs = [
  {
    nom: "Sporting Promotion",
    logo: "/images/sporting-promotion-logo.png",
    description:
      "Depuis 1995, plus de 9 000 logements construits en près de 30 ans.",
  },
  {
    nom: "GreenCity Immobilier",
    logo: "/images/greencity-logo.png",
    description:
      "4ème promoteur indépendant français, plus de 17 000 logements livrés, 28 Pyramides FPI dont 3 Pyramides d'Or nationales.",
  },
];

export function Promoteurs() {
  return (
    <section className="bg-blanc-casse py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <AnimateOnScroll>
          <h2 className="mb-12 text-center text-3xl font-bold text-sauge-very-dark md:text-4xl">
            Des promoteurs de confiance
          </h2>
        </AnimateOnScroll>

        <div className="grid gap-8 md:grid-cols-2">
          {promoteurs.map((p, i) => (
            <AnimateOnScroll key={p.nom} delay={i * 0.1}>
              <div className="flex flex-col items-center gap-6 rounded-2xl border border-sable/30 bg-white p-8 text-center">
                <div className="relative h-16 w-48">
                  <Image
                    src={p.logo}
                    alt={`Logo ${p.nom}`}
                    fill
                    className="object-contain"
                    loading="lazy"
                    sizes="192px"
                  />
                </div>
                <h3 className="text-lg font-semibold text-sauge-very-dark">
                  {p.nom}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {p.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
