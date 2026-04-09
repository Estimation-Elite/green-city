import { Sun, ShieldCheck, Banknote, TreePine } from "lucide-react";

const points = [
  {
    icon: Sun,
    title: "Luminosité exceptionnelle",
    text: "Des séjours de grands volumes baignés de lumière naturelle. Tous les logements disposent d'un extérieur — jardin privatif, loggia, balcon ou terrasse — pour vivre avec la nature.",
  },
  {
    icon: ShieldCheck,
    title: "Certifié NF Habitat HQE",
    text: "Un label qui garantit qualité de construction, confort acoustique renforcé, qualité de l'air intérieur et consommations énergétiques maîtrisées. Contrôle Bureau Veritas.",
  },
  {
    icon: TreePine,
    title: "Écoquartier Faubourg Malepère",
    text: "Un cadre de vie « comme à la campagne », entouré de parcs et d'espaces naturels. Pistes cyclables, ruisseau de la Marcaissonne et Parc Catala à proximité.",
  },
  {
    icon: Banknote,
    title: "Aides à l'accession",
    text: "Bénéficiez du Prêt à Taux Zéro (PTZ) pour financer votre résidence principale, et profitez de frais de notaire réduits dans le neuf.",
  },
];

export function Habiter() {
  return (
    <div className="py-20 bg-light">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-3xl mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Résidence principale
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Habiter à Révélation
          </h2>
          <p className="text-muted mt-3 leading-relaxed">
            Un cadre de vie d&apos;exception entre ville et campagne, alliant
            nature omniprésente, confort moderne et logement intelligent connecté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {points.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <a
            href="#contact"
            className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Télécharger la brochure
          </a>
        </div>
      </div>
    </div>
  );
}
