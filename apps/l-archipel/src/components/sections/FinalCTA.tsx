import { Clock, Shield } from "lucide-react";
import { BrochureForm } from "@repo/ui";
import { brochureData } from "@/data/archipel";

export function FinalCTA() {
  return (
    <div className="py-20 bg-dark text-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Argumentaire */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Je veux recevoir des informations sur{" "}
              <span className="text-accent">ce programme</span>
            </h2>
            <p className="text-white/75 leading-relaxed">
              L&apos;Archipel réunit tout ce que vous recherchez : une architecture
              chaleureuse avec façades bois au cœur d&apos;un jardin paysagé, un
              quartier résidentiel prisé à Toulouse La Maourine, des certifications
              de qualité (NF Habitat, RE 2020) et des terrasses en bois pour chaque logement.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm text-white/80">
                  Frais de notaire réduits dans le neuf
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm text-white/80">
                  Rappel sous 24h par un conseiller dédié
                </span>
              </div>
            </div>
          </div>

          {/* Formulaire brochure multi-step */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold mb-1">
              Téléchargez la brochure
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Remplissez le formulaire pour recevoir votre documentation complète.
            </p>
            <BrochureForm
              pdfUrl={brochureData.pdfUrl}
              pdfFilename={brochureData.pdfFilename}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
