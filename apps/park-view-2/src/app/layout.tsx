import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Park View 2 — Appartements neufs T2 à T5 à Toulouse Empalot | TVA 5,5%",
  description:
    "Découvrez Park View 2 : 74 logements neufs du T2 au T5 à Toulouse Empalot, à 1 min du métro. TVA réduite 5,5%, certification NF Habitat HQE. Recevez la plaquette.",
  openGraph: {
    title:
      "Park View 2 — Appartements neufs T2 à T5 à Toulouse Empalot | TVA 5,5%",
    description:
      "74 logements neufs du T2 au T5 à Toulouse Empalot. TVA réduite 5,5%, certification NF Habitat HQE.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
