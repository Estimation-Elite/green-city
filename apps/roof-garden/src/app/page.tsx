import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { Equipment } from "@/components/sections/Equipment";
import { Testimonials } from "@/components/sections/Testimonials";
import { Conversations } from "@/components/sections/Conversations";
import { VirtualTour } from "@/components/sections/VirtualTour";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { Proximity } from "@/components/sections/Proximity";
import { ProjectOverview } from "@/components/sections/ProjectOverview";
import { LocationMap } from "@/components/sections/LocationMap";
import { Connectivity } from "@/components/sections/Connectivity";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section id="value-proposition">
          <ValueProposition />
        </section>
        <Equipment />
        <Testimonials />
        <Conversations />
        <VirtualTour />
        <section id="galerie">
          <PhotoGallery />
        </section>
        <Proximity />
        <ProjectOverview />
        <section id="localisation">
          <LocationMap />
        </section>
        <Connectivity />
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  );
}
