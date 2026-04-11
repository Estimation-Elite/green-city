import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Advantages } from "@/components/sections/Advantages";
import { Program } from "@/components/sections/Program";
import { Habiter } from "@/components/sections/Habiter";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { Reassurance } from "@/components/sections/Reassurance";
import { LocationMap } from "@/components/sections/LocationMap";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { StickyCtaBar } from "@repo/ui";
import { brochureData } from "@/data/archipel";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pb-24">
        <Hero />
        <section id="avantages">
          <Advantages />
        </section>
        <section id="programme">
          <Program />
        </section>
        <section id="habiter">
          <Habiter />
        </section>
        <section id="galerie">
          <PhotoGallery />
        </section>
        <section id="contact">
          <FinalCTA />
        </section>
        <section id="reassurance">
          <Reassurance />
        </section>
        <section id="localisation">
          <LocationMap />
        </section>
      </main>
      <Footer />
      <StickyCtaBar
        pdfUrl={brochureData.pdfUrl}
        pdfFilename={brochureData.pdfFilename}
      />
    </>
  );
}
