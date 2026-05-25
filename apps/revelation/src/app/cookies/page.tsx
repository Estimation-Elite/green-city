import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookiePolicy } from "@repo/ui";
import { legalData } from "@/data/revelation";

export const metadata = {
  title: "Politique des cookies",
};

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        <CookiePolicy data={legalData} />
      </main>
      <Footer />
    </>
  );
}
