import { Sun, ShieldCheck, Banknote, TreePine } from "lucide-react";

const points = [
  {
    icon: Sun,
    title: "Cadre de vie paisible",
    text: "Dans l'ancien quartier maraîcher de La Maourine, devenu un secteur résidentiel prisé du nord de Toulouse. À seulement 4,5 km de la place du Capitole.",
  },
  {
    icon: ShieldCheck,
    title: "Certifié NF Habitat",
    text: "Un label Bureau Veritas qui garantit qualité de construction, confort acoustique et thermique. Conformité RE 2020 seuil 2025.",
  },
  {
    icon: TreePine,
    title: "Nature et proximité",
    text: "Jardins du Muséum et Parc de la Maourine à 1 km. Pistes cyclables à 150m. Métro B Trois Cocus à 250m, Borderouge à 600m.",
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
            Habiter à L&apos;Archipel
          </h2>
          <p className="text-muted mt-3 leading-relaxed">
            Un cadre de vie d&apos;exception dans le quartier de La Maourine, alliant
            nature en ville, confort certifié et accès rapide au centre de Toulouse.
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
