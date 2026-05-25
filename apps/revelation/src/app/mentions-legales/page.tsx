import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalMentions } from "@repo/ui";
import { legalData } from "@/data/revelation";

export const metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        <LegalMentions data={legalData} />
      </main>
      <Footer />
    </>
  );
}
