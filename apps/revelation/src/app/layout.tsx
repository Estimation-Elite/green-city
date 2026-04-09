import type { Metadata } from "next";
import { Toaster } from "sonner";
import { GTM } from "@repo/core/analytics/GTM";
import "./globals.css";

export const metadata: Metadata = {
  title: "Révélation | Appartements neufs à Toulouse Faubourg Malepère",
  description:
    "Découvrez Révélation, programme immobilier neuf à Toulouse Faubourg Malepère. 168 appartements du T1 au T5 avec extérieur, certifiés NF Habitat HQE, au cœur d'un écoquartier verdoyant.",
  openGraph: {
    title: "Révélation | Appartements neufs à Toulouse Faubourg Malepère",
    description:
      "168 appartements lumineux du T1 au T5 au cœur de l'écoquartier Faubourg Malepère. Architecture contemporaine inspirée de la brique rose, certification NF Habitat HQE et Effinature.",
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
