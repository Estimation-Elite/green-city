import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Révélation Toulouse | 168 appartements neufs T1-T5 Route de Revel",
  description:
    "Découvrez Révélation, programme immobilier neuf à Toulouse Faubourg Malepère. 168 appartements du T1 au T5, architecture signée Benoît Jallon (LAN). Certification NF Habitat HQE, RE 2020.",
  openGraph: {
    title: "Révélation Toulouse | 168 appartements neufs T1-T5 Route de Revel",
    description:
      "Programme immobilier neuf à Toulouse. 168 appartements du T1 au T5, certifiés NF Habitat HQE. Future ligne C du métro à proximité.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${lexend.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-white flex flex-col">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
