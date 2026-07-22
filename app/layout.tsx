import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escenarios Colombia",
  description:
    "Casos, credibilidad del discurso y escenarios políticos — Colombia",
};

const links = [
  { href: "/", label: "Inicio" },
  { href: "/casos", label: "Casos" },
  { href: "/gaps", label: "Gaps" },
  { href: "/escenarios", label: "Escenarios" },
  { href: "/fuentes", label: "Fuentes" },
  { href: "/playbook", label: "Playbook" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;550;650&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="shell">
          <nav>
            <Link href="/" className="brand">
              Escenarios Colombia
            </Link>
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
