import { Suspense } from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { ContactForm } from "@/components/forms/ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4">
        <AnimateOnScroll>
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold text-sauge-very-dark md:text-4xl">
              Recevez votre plaquette et les disponibilités
            </h2>
            <p className="text-gray-600">
              Remplissez le formulaire ci-dessous et recevez gratuitement la
              plaquette du programme Park View 2.
            </p>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.1}>
          <div className="rounded-2xl border border-sable/30 bg-blanc-casse p-6 md:p-8">
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
