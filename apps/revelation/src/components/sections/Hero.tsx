"use client";

import * as React from "react";
import { LandingHero, LeadModal } from "@repo/ui";
import { heroData, contactData } from "@/data/revelation";

export function Hero() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <LandingHero
        {...heroData}
        onPrimaryCtaClick={() => setModalOpen(true)}
      />
      <LeadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        modalTitle="Recevez votre brochure Révélation"
        modalSubtitle="Laissez vos coordonnées et recevez la brochure complète du programme ainsi que les plans et prix des appartements disponibles."
        situationOptions={contactData.situationOptions}
      />
    </>
  );
}
