import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GreenCity FB Leads Webhook",
  description:
    "Webhook intermediaire entre Facebook Lead Ads et l'API GreenCity ERP.",
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
