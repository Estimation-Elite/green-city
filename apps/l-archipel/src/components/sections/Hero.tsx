import Image from "next/image";
import { LeadForm } from "@/components/ui/LeadForm";
import { LiveViewerCount } from "@/components/ui/LiveViewerCount";
import { LotsAvailableBadge } from "@/components/ui/LotsAvailableBadge";
import { socialProofData } from "@/data/archipel";

export function Hero() {
  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Background image */}
      <Image
        src="/images/EdmondRostand_VueIlot_Web.jpg"
        alt="L'Archipel — Vue d'ensemble de la résidence à Toulouse La Maourine"
        fill
        className="object-cover"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-dark/40" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Texte */}
          <div className="flex-1 text-white space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block bg-accent text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                Toulouse — La Maourine
              </span>
              <LotsAvailableBadge count={socialProofData.lotsAvailable} variant="accent" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              L&apos;Archipel :<br />
              votre résidence au cœur de{" "}
              <span className="text-accent">Toulouse La Maourine</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed">
              48 appartements du T2 au T5 dans 2 bâtiments autour d&apos;un jardin
              central paysagé. Façades claires et charpente bois apparente,
              à 250m du métro Trois Cocus.
            </p>

            {/* Stats */}
            <div className="flex gap-8 pt-2">
              {[
                { value: "48", label: "Appartements" },
                { value: "T2–T5", label: "Typologies" },
                { value: "2", label: "Bâtiments" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-xs text-white/70 uppercase tracking-wide mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <LiveViewerCount variant="dark" />

            {/* Boutons de segmentation */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#habiter"
                className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-primary-light transition"
              >
                Je veux habiter
              </a>
              {/* <a
                href="#investir"
                className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition"
              >
                Je veux investir
              </a> */}
            </div>
          </div>

          {/* Formulaire rapide */}
          <div className="w-full lg:w-[400px] bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-white text-lg font-bold mb-1">
              Recevez votre documentation
            </h2>
            <p className="text-white/70 text-sm mb-4">
              Un conseiller vous rappelle sous 24h
            </p>
            <LeadForm variant="dark" buttonLabel="Être rappelé(e)" />
          </div>
        </div>
      </div>
    </div>
  );
}
