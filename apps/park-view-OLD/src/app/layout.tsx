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
  title: "Park View 2 Toulouse | Appartements neufs à Empalot",
  description:
    "Découvrez Park View 2, programme immobilier neuf à Toulouse Empalot. 74 appartements T2 à T5 avec terrasses jusqu'à 80 m². Certification NF Habitat HQE.",
  openGraph: {
    title: "Park View 2 Toulouse | Appartements neufs à Empalot",
    description:
      "Programme immobilier neuf à Toulouse Empalot. 74 appartements T2 à T5, certifiés NF Habitat HQE. Métro à 1 min.",
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
