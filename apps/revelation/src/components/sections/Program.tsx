import Image from "next/image";
import { Check } from "lucide-react";
import { LiveViewerCount } from "@/components/ui/LiveViewerCount";

const features = [
  "Jardin privatif, loggia, balcon ou terrasse",
  "Cuisine équipée (plaque vitrocéramique, hotte, réfrigérateur-congélateur)",
  "Salle de bain équipée (sèche-serviettes, lave-linge)",
  "Carrelage 45x45 et parquet stratifié",
  "Placards aménagés et rangements intégrés",
  "Terrasse bois pour les grands logements",
  "225 places de parking en sous-sol sur 2 niveaux",
  "Abris vélos extérieurs et locaux vélos sécurisés",
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
            5 collectifs avec un grand espace central boisé, des jardins et des
            cheminements piétonniers au cœur du Faubourg Malepère.
          </p>
          <div className="flex justify-center mt-6">
            <LiveViewerCount variant="light" />
          </div>
        </div>

        {/* Description + images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="space-y-5">
            <p className="text-foreground/85 leading-relaxed">
              La résidence Révélation est composée d&apos;un ensemble regroupant{" "}
              <strong>5 collectifs avec un grand espace central boisé</strong>,
              de beaux jardins et des cheminements piétonniers. Ces espaces de
              verdure apportent une réelle quiétude à tous les résidents.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              L&apos;uniformité architecturale du projet se retrouve dans les
              matériaux utilisés : façades de teinte claire inspirée de la brique
              rose toulousaine et volets à persiennes en bois. Les bâtiments
              varient du R+2 au R+7 maximum.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              Chaque logement est pensé pour offrir une très grande fonctionnalité
              avec des séjours de grands volumes qui profitent d&apos;une luminosité
              exceptionnelle. Tous bénéficient d&apos;un extérieur (jardin privatif,
              loggia, balcon ou terrasse).
            </p>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden">
              <Image
                src="/images/RtedeRevel_VueTerrasse.jpg"
                alt="Terrasse bois d'un appartement Révélation"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  Terrasse bois avec vue dégagée
                </p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden">
              <Image
                src="/images/RtedeRevel_Masse.jpg"
                alt="Plan masse de la résidence Révélation"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  Promenade paysagée centrale
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
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
