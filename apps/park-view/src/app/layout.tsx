import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home Spirit 2 | Appartements neufs à Toulouse Montaudran – Aerospace",
  description:
    "Découvrez Home Spirit 2, programme immobilier neuf à Toulouse Aerospace Montaudran. 79 appartements du T2 au T5 avec balcon ou terrasse, certifiés NF Habitat HQE, à deux pas du métro Aerospace Campus.",
  openGraph: {
    title: "Home Spirit 2 | Appartements neufs à Toulouse Montaudran",
    description:
      "79 appartements lumineux du T2 au T5 au cœur du quartier Aerospace Montaudran. Architecture contemporaine, balcons arrondis, certification NF Habitat HQE.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <div className="min-h-screen bg-white flex flex-col">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
