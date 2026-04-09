import { TrendingUp, Building2, PiggyBank, MapPin } from "lucide-react";

const points = [
  {
    icon: MapPin,
    title: "Quartier en pleine mutation",
    text: "Le Faubourg Malepère, pôle majeur d'activité économique et d'enseignement, attire entreprises et talents. Proximité d'Airbus Defence & Space, du Parc Technologique du Canal et de Labège-Innopole.",
  },
  {
    icon: Building2,
    title: "Qualité patrimoniale",
    text: "Architecture durable certifiée NF Habitat HQE et Effinature, matériaux pérennes inspirés de la brique rose. Un bien qui conserve sa valeur dans le temps.",
  },
  {
    icon: PiggyBank,
    title: "Défiscalisation avantageuse",
    text: "Éligibilité aux dispositifs Pinel / Pinel+ pour réduire vos impôts sur 6 à 12 ans. Le statut LMNP est aussi envisageable pour les T1/T2/T3 en location meublée.",
  },
  {
    icon: TrendingUp,
    title: "Rendement sécurisé",
    text: "Forte demande locative grâce à la proximité des universités (Paul Sabatier, INSA, ENAC), du CHU de Rangueil et de la future ligne C du métro.",
  },
];

export function Investir() {
  return (
    <div className="py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-3xl mb-14">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            Investissement locatif
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Investir à Révélation
          </h2>
          <p className="text-muted mt-3 leading-relaxed">
            Un emplacement stratégique au sud-est de Toulouse, une qualité de
            construction reconnue et des dispositifs fiscaux attractifs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {points.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-accent" />
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
            className="bg-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent-dark transition"
          >
            Télécharger la brochure
          </a>
        </div>
      </div>
    </div>
  );
}
