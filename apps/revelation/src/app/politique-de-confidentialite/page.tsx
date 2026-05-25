import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyPolicy } from "@repo/ui";
import { legalData } from "@/data/revelation";

export const metadata = {
  title: "Politique de confidentialité",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        <PrivacyPolicy data={legalData} />
      </main>
      <Footer />
    </>
  );
}
