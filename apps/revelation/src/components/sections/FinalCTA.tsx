import { Clock, Shield } from "lucide-react";
import { LeadForm } from "@/components/ui/LeadForm";
import { LiveViewerCount } from "@/components/ui/LiveViewerCount";
import { LotsAvailableBadge } from "@/components/ui/LotsAvailableBadge";
import { socialProofData } from "@/data/revelation";

export function FinalCTA() {
  return (
    <div className="py-20 bg-dark text-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Argumentaire */}
          <div className="space-y-6">
            <LotsAvailableBadge count={socialProofData.lotsAvailable} variant="accent" />
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Concrétisez votre projet{" "}
              <span className="text-accent">immobilier</span>
            </h2>
            <p className="text-white/75 leading-relaxed">
              Révélation réunit tout ce que vous recherchez : un écoquartier
              verdoyant au Faubourg Malepère, des logements lumineux et connectés
              du T1 au T5, des certifications de qualité (NF Habitat HQE,
              Effinature) et un extérieur pour chaque logement.
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

          {/* Formulaire complet */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <LiveViewerCount variant="dark" className="mb-4" />
            <h3 className="text-xl font-bold mb-1">
              Contactez-nous dès maintenant
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Remplissez le formulaire ci-dessous pour recevoir votre
              documentation complète et être rappelé(e) par un conseiller.
            </p>
            <LeadForm variant="dark" buttonLabel="Envoyer ma demande" />
          </div>
        </div>
      </div>
    </div>
  );
}
