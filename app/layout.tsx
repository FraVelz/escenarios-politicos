import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Escenarios Colombia",
    template: "%s · Escenarios Colombia",
  },
  description:
    "Casos, credibilidad del discurso y escenarios políticos — Colombia",
  openGraph: {
    title: "Escenarios Colombia",
    description:
      "Casos y credibilidad del discurso — análisis político Colombia",
    type: "website",
    locale: "es_CO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Escenarios Colombia",
    description:
      "Casos y credibilidad del discurso — análisis político Colombia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
