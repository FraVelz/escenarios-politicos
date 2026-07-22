import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { PageAtmosphere } from "@/components/PageAtmosphere";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
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
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="relative min-h-full bg-black font-sans text-foreground">
        <PageAtmosphere />
        <SkipLink />
        <SiteHeader />
        <div
          id="contenido-principal"
          tabIndex={-1}
          className="relative z-0 mx-auto max-w-[1200px] px-4 pb-16 pt-8 outline-none sm:px-6 lg:px-8"
        >
          {children}
        </div>
      </body>
    </html>
  );
}
