import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Check } from "lucide-react";

const t2t3 = [
  "Cuisines équipées",
  "Carrelage grand format 45×45 cm",
  "Menuiseries aluminium double vitrage",
  "Salle de bain aménagée (meuble vasque, miroir, appliques)",
  "Rangements intégrés",
  "Volets roulants",
  "Chauffage raccordé au réseau de chaleur urbain",
];

const t4t5Extras = [
  "Terrasses jusqu'à 80 m²",
  "Parquet flottant (hors pièces humides)",
  "Volets roulants électriques",
];

function PrestationList({
  items,
  accent = false,
}: {
  items: string[];
  accent?: boolean;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Check
            className={`mt-0.5 h-5 w-5 shrink-0 ${accent ? "text-ocre" : "text-sauge"}`}
          />
          <span className="text-sm leading-relaxed text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Prestations() {
  return (
    <section className="bg-blanc-casse py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <AnimateOnScroll>
          <h2 className="mb-12 text-center text-3xl font-bold text-sauge-very-dark md:text-4xl">
            Des prestations de qualité
          </h2>
        </AnimateOnScroll>

        <div className="grid gap-8 md:grid-cols-2">
          <AnimateOnScroll>
            <div className="rounded-2xl border border-sable/30 bg-white p-8">
              <div className="mb-6 inline-flex rounded-full bg-sauge/10 px-4 py-1.5 text-sm font-semibold text-sauge-dark">
                T2 & T3
              </div>
              <PrestationList items={t2t3} />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.1}>
            <div className="rounded-2xl border border-ocre/20 bg-white p-8 ring-1 ring-ocre/10">
              <div className="mb-6 inline-flex rounded-full bg-ocre/10 px-4 py-1.5 text-sm font-semibold text-ocre-dark">
                T4 & T5
              </div>
              <PrestationList items={t2t3} />
              <div className="my-4 border-t border-sable/30" />
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ocre-dark">
                En plus
              </p>
              <PrestationList items={t4t5Extras} accent />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
