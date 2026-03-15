import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hosmos — ESG Platform for SMEs",
  description:
    "Calculate ESG indicators, manage non-financial data, and auto-generate reports compliant with EU standards. Onboarding in under 30 minutes.",
  keywords: ["ESG", "CSRD", "GRI", "sustainability", "carbon", "Scope 1", "Scope 2", "Scope 3", "SME"],
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
