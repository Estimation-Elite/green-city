import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Advantages } from "@/components/sections/Advantages";
import { Program } from "@/components/sections/Program";
import { Habiter } from "@/components/sections/Habiter";
import { Investir } from "@/components/sections/Investir";
import { Reassurance } from "@/components/sections/Reassurance";
import { LocationMap } from "@/components/sections/LocationMap";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
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
        <section id="investir">
          <Investir />
        </section>
        <section id="reassurance">
          <Reassurance />
        </section>
        <section id="localisation">
          <LocationMap />
        </section>
        <section id="contact">
          <FinalCTA />
        </section>
      </main>
      <Footer />
    </>
  );
}
