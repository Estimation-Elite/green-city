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
  title: "Roof Garden Grenoble | Appartements neufs face au Vercors",
  description:
    "Découvrez Roof Garden, programme immobilier neuf à Grenoble. Appartements 1 à 4 pièces avec vue sur le Vercors. Devenez propriétaire à partir de 490€/mois.",
  openGraph: {
    title: "Roof Garden Grenoble | Appartements neufs face au Vercors",
    description:
      "Programme immobilier neuf à Grenoble avec vue sur le Vercors. À partir de 490€/mois.",
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
