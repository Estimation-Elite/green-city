import Image from "next/image";
import { Check } from "lucide-react";
import { LiveViewerCount } from "@/components/ui/LiveViewerCount";

const features = [
  "Balcon ou terrasse pour chaque logement",
  "Salle de sport en résidence",
  "Locaux vélos sécurisés",
  "Stationnements en sous-sol et rez-de-chaussée",
  "Double vitrage haute performance",
  "Carrelage grand format",
  "Cuisine équipée",
  "Volets roulants électriques",
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
            Une architecture contemporaine aux lignes douces et balcons arrondis,
            dans un environnement végétalisé.
          </p>
          <div className="flex justify-center mt-6">
            <LiveViewerCount variant="light" />
          </div>
        </div>

        {/* Description + images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="space-y-5">
            <p className="text-foreground/85 leading-relaxed">
              Home Spirit 2 propose <strong>79 logements du T2 au T5</strong>,
              conçus pour répondre aux usages d&apos;aujourd&apos;hui. L&apos;architecture
              contemporaine aux balcons arrondis apporte douceur et élégance à
              l&apos;ensemble, tandis que les coursives végétalisées créent une
              atmosphère résidentielle unique.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              Chaque appartement bénéficie d&apos;un extérieur — balcon ou terrasse —
              pour profiter du climat toulousain. Les grands attiques disposent de
              terrasses généreuses avec vues dégagées sur le quartier.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              L&apos;approche <strong>Effinature</strong>&nbsp;de GreenCity assure une
              conception respectueuse de l&apos;environnement : matériaux durables,
              performances thermiques élevées et intégration harmonieuse dans le
              paysage urbain.
            </p>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden">
              <Image
                src="/images/HomeSpirit2_VueRooftop_Web.jpg"
                alt="Vue du rooftop — grands extérieurs pour les appartements en attique"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  Grands extérieurs pour les attiques
                </p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden">
              <Image
                src="/images/HomeSpirit2_VueRue_01.jpg"
                alt="Vue sur la venelle piétonne et les espaces verts"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  Venelle piétonne &amp; espaces verts
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
