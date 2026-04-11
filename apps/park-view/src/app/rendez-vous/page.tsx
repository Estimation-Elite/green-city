import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VisitWizard } from "@repo/ui";
import { CheckCircle2 } from "lucide-react";

export default function RendezVousPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Information */}
            <div className="space-y-6">
              <h1 className="text-[28px] lg:text-[32px] font-bold text-gray-900 leading-tight">
                Visitez Park View avec nos conseillers
              </h1>

              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 text-[15px]">
                    Découvrez les lots disponibles et les plans détaillés
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 text-[15px]">
                    Visitez l&apos;appartement témoin sur place
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 text-[15px]">
                    Échangez avec notre équipe sur les conditions et le
                    financement
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mt-6">
                Notre conseiller vous recontactera pour confirmer votre
                rendez-vous et répondre à vos premières questions.
              </p>
            </div>

            {/* Right Column - Wizard */}
            <div className="w-full">
              <VisitWizard
                projectName="Park View"
                projectAddress="Quartier Empalot, Toulouse"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
