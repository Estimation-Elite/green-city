import { Sun, ShieldCheck, Banknote, TreePine } from "lucide-react";

const points = [
  {
    icon: Sun,
    title: "Lumière et confort",
    text: "Des appartements traversants ou bi-orientés, baignés de lumière naturelle, avec des espaces extérieurs généreux pour profiter du quotidien.",
  },
  {
    icon: ShieldCheck,
    title: "Certifié NF Habitat HQE",
    text: "Un label qui garantit qualité de construction, confort acoustique, thermique et respect de l'environnement. Conformité RE 2020 seuil 2025.",
  },
  {
    icon: TreePine,
    title: "Quartier connecté et serein",
    text: "À proximité du métro Aerospace Campus, de la Piste des Géants et des commerces. Un cadre de vie à la fois dynamique et paisible.",
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
            Habiter à Home Spirit 2
          </h2>
          <p className="text-muted mt-3 leading-relaxed">
            Un cadre de vie d&apos;exception pour votre famille, alliant confort
            moderne, nature en ville et consommations énergétiques maîtrisées.
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
