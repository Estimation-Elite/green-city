import { Header } from "@/components/layout/Header";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { Hero } from "@/components/sections/Hero";
import { PointsForts } from "@/components/sections/PointsForts";
import { Quartier } from "@/components/sections/Quartier";
import { Residence } from "@/components/sections/Residence";
import { Prestations } from "@/components/sections/Prestations";
import { Dispositifs } from "@/components/sections/Dispositifs";
import { Promoteurs } from "@/components/sections/Promoteurs";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <Hero />
        <PointsForts />
        <Quartier />
        <Residence />
        <Prestations />
        <Dispositifs />
        <Promoteurs />
        <ContactSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </div>
  );
}
