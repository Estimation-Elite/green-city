import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import {
  TrainFront,
  Wallet,
  ShieldCheck,
  Leaf,
  Sun,
  Trees,
  Car,
} from "lucide-react";

const points = [
  {
    icon: TrainFront,
    title: "Métro ligne B",
    description: "Station Empalot à 1-3 min à pied, 3 stations du centre-ville",
  },
  {
    icon: Wallet,
    title: "TVA réduite 5,5%",
    description: "Sous conditions de ressources, cumulable avec le PTZ",
  },
  {
    icon: ShieldCheck,
    title: "NF Habitat HQE",
    description: "Certification qualité et performance environnementale",
  },
  {
    icon: Leaf,
    title: "RE 2020 seuil 2025",
    description: "Réglementation environnementale dernière génération",
  },
  {
    icon: Sun,
    title: "Espaces extérieurs",
    description: "Loggias ou terrasses pour tous les logements",
  },
  {
    icon: Trees,
    title: "Cœur d'îlot paysager",
    description: "Toiture végétalisée avec 5 arbres, espace de convivialité",
  },
  {
    icon: Car,
    title: "Parking sécurisé",
    description: "Places de stationnement et local vélos sécurisé",
  },
];

export function PointsForts() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <AnimateOnScroll>
          <h2 className="mb-12 text-center text-3xl font-bold text-sauge-very-dark md:text-4xl">
            Les points forts du programme
          </h2>
        </AnimateOnScroll>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {points.map((point, i) => (
            <AnimateOnScroll key={point.title} delay={i * 0.07}>
              <div className="flex flex-col items-start gap-3 rounded-2xl border border-sable/30 bg-blanc-casse p-6 transition hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sauge/10">
                  <point.icon className="h-5 w-5 text-sauge" />
                </div>
                <h3 className="text-base font-semibold text-sauge-very-dark">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {point.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
