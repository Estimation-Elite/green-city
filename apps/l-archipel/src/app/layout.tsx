import type { Metadata } from "next";
import { Toaster } from "sonner";
import { GTM } from "@repo/core/analytics/GTM";
import "./globals.css";

export const metadata: Metadata = {
  title: "L'Archipel | Appartements neufs à Toulouse La Maourine — du T2 au T5",
  description:
    "Découvrez L'Archipel, programme immobilier neuf à Toulouse La Maourine. 48 appartements du T2 au T5 autour d'un jardin central paysagé, certifiés NF Habitat RE 2020, à 250m du métro Trois Cocus (ligne B).",
  openGraph: {
    title: "L'Archipel | Appartements neufs à Toulouse La Maourine",
    description:
      "48 appartements du T2 au T5 dans 2 bâtiments autour d'un jardin central. Façades bois, terrasses en bois, parking sous-sol. À 250m du métro Trois Cocus.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtmId = process.env.GTM_ID;

  return (
    <html lang="fr">
      <body className="antialiased">
        <GTM gtmId={gtmId} />
        <div className="min-h-screen bg-white flex flex-col">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
