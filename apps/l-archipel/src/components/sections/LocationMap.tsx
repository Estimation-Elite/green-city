import { MapPin, TrainFront, ShoppingBag, TreePine } from "lucide-react";

const pois = [
  { icon: TrainFront, label: "Métro Trois Cocus (Ligne B)", distance: "250m — 3 min à pied" },
  { icon: TrainFront, label: "Métro Borderouge (Ligne B)", distance: "600m — 8 min à pied" },
  { icon: TreePine, label: "Parc de la Maourine", distance: "1 km" },
  { icon: MapPin, label: "Place du Capitole", distance: "4,5 km — 15 min en métro" },
];

export function LocationMap() {
  return (
    <div className="py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Un emplacement stratégique
          </h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            Au cœur du quartier La Maourine, dans le nord résidentiel de Toulouse,
            à proximité immédiate du métro B et des espaces verts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte Google Maps */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-sm h-[400px] lg:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2888.5!2d1.4380!3d43.6350!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCszgnMDYuMCJOIDHCsDI2JzE2LjgiRQ!5e0!3m2!1sfr!2sfr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation L'Archipel — 178 Rue Edmond Rostand, 31200 Toulouse"
            />
          </div>

          {/* Points d'intérêt */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground mb-4">
              À proximité
            </h3>
            {pois.map((poi) => (
              <div
                key={poi.label}
                className="flex items-center gap-4 bg-light rounded-xl p-4"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <poi.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {poi.label}
                  </p>
                  <p className="text-xs text-muted">{poi.distance}</p>
                </div>
              </div>
            ))}

            <a
              href="https://www.google.com/maps/@43.6350,1.4380,16z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline mt-4"
            >
              <MapPin className="w-4 h-4" />
              Voir sur Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
