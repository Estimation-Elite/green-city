import { TrainFront, Leaf, Trees, Maximize } from "lucide-react";

const advantages = [
  {
    icon: TrainFront,
    title: "Transports à portée de main",
    description:
      "Arrêt de bus à 1 min, piste cyclable à 250 m, future ligne C du métro à 2 km. Accès rapide au périphérique (sortie 18) et à l'A61.",
  },
  {
    icon: Leaf,
    title: "Écoquartier responsable",
    description:
      "Résidence certifiée NF Habitat HQE et Effinature, conforme RE 2020. Un habitat écologique et contemporain ancré dans son territoire.",
  },
  {
    icon: Trees,
    title: "Nature au quotidien",
    description:
      "Grand espace central boisé, jardins paysagés et promenade verte. Un cadre « comme à la campagne » au calme, à l'abri du tumulte.",
  },
  {
    icon: Maximize,
    title: "Logements spacieux",
    description:
      "168 appartements du T1 au T5 avec jardin privatif, loggia, balcon ou terrasse. Des séjours lumineux avec vue sur la nature environnante.",
  },
];

export function Advantages() {
  return (
    <div className="bg-light py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Pourquoi choisir Révélation ?
          </h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            Un programme pensé pour conjuguer calme, nature et dynamisme au cœur du Faubourg Malepère.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
            >
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition">
                <item.icon className="w-6 h-6 text-primary group-hover:text-white transition" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
