import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import {
  ShoppingCart,
  TrainFront,
  Bus,
  TreePine,
  Trophy,
  GraduationCap,
  CarFront,
  Plane,
} from "lucide-react";

const proximites = [
  { icon: ShoppingCart, label: "Supermarché", temps: "1 min à pied" },
  { icon: TrainFront, label: "Métro B Empalot", temps: "1-3 min à pied" },
  { icon: Bus, label: "Bus L5, lignes 44, 54, 152", temps: "1 min à pied" },
  {
    icon: TreePine,
    label: "Parc Picot de Lapeyrouse (7 ha)",
    temps: "15 min à pied",
  },
  { icon: Trophy, label: "Stadium TFC", temps: "4 min à vélo" },
  {
    icon: GraduationCap,
    label: "Université Paul Sabatier",
    temps: "9 min à vélo",
  },
  { icon: CarFront, label: "Accès autoroute", temps: "5 min en voiture" },
  {
    icon: Plane,
    label: "Aéroport Toulouse-Blagnac",
    temps: "15 min en voiture",
  },
];

export function Quartier() {
  return (
    <section className="bg-blanc-casse py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <AnimateOnScroll>
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-sauge-very-dark md:text-4xl">
                Empalot, un quartier en pleine transformation
              </h2>
              <p className="leading-relaxed text-gray-600">
                Situé au sud du centre-ville de Toulouse, à deux pas de l'Île du
                Ramier et des berges de Garonne, le quartier Empalot bénéficie
                d'un renouveau urbain ambitieux. Parfaitement connecté et
                dynamique, Empalot conjugue centralité, accessibilité et qualité
                de vie.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {proximites.map((p) => (
                  <div
                    key={p.label}
                    className="flex items-center gap-3 rounded-xl bg-white p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sauge/10">
                      <p.icon className="h-4 w-4 text-sauge" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-sauge-very-dark">
                        {p.label}
                      </p>
                      <p className="text-xs text-gray-500">{p.temps}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/Empalot_Park_View_Vue18_Web.jpg"
                alt="Vue du quartier Empalot et de la résidence Park View 2"
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
