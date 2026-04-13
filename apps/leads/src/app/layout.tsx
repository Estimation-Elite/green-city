import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenCity Leads",
  description: "Console dediee a la consultation des leads GreenCity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
