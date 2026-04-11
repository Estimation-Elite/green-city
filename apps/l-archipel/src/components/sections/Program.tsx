import Image from "next/image";
import { Check } from "lucide-react";

const features = [
  "Terrasse en bois pour chaque logement",
  "36 places de parking en sous-sol",
  "Locaux deux roues et vélos sécurisés",
  "Ascenseur desservant jardin et sous-sol",
  "Vidéophone avec appel sur smartphone",
  "Cuisine équipée (T2 & T3)",
  "Menuiserie extérieure PVC double vitrage",
  "Placards aménagés",
];

export function Program() {
  return (
    <div className="py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Découvrez le programme
          </h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            Deux bâtiments aux façades claires et charpente bois,
            organisés autour d&apos;un jardin central paysagé.
          </p>
        </div>

        {/* Description + images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="space-y-5">
            <p className="text-foreground/85 leading-relaxed">
              L&apos;Archipel propose <strong>48 logements du T2 au T5</strong>,
              répartis dans 2 bâtiments organisés autour d&apos;un jardin central
              paysagé. L&apos;architecture aux façades enduit clair et charpente bois
              apparente s&apos;intègre dans le quartier résidentiel de La Maourine.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              Chaque appartement bénéficie d&apos;une terrasse en bois pour profiter
              du cadre végétalisé. Les toitures inclinées aux hauteurs variées
              confèrent au programme son identité architecturale distinctive.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              Conçu par <strong>EMPAN Architectes</strong> pour GreenCity Immobilier
              et Acte-S Promotion, L&apos;Archipel allie qualité de construction
              certifiée NF Habitat et respect de l&apos;environnement (RE 2020 seuil 2025).
            </p>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden">
              <Image
                src="/images/EdmondRostand_VueJardins_Web.jpg"
                alt="Jardin central paysagé entre les deux bâtiments de L'Archipel"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  Jardin central paysagé
                </p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden">
              <Image
                src="/images/EdmondRostand_VueRue_Web.jpg"
                alt="Vue depuis la rue Edmond Rostand — façade de L'Archipel"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  Vue depuis la rue Edmond Rostand
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="bg-primary-light rounded-2xl p-8 md:p-10">
          <h3 className="text-xl font-bold text-foreground mb-6">
            Caractéristiques et prestations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/85">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
