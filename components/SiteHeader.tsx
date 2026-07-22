"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/casos", label: "Casos" },
  { href: "/gaps", label: "Gaps" },
  { href: "/escenarios", label: "Escenarios" },
  { href: "/fuentes", label: "Fuentes" },
  { href: "/playbook", label: "Playbook" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 -mx-4 mb-8 border-b border-border/80 bg-background/80 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex h-14 items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground no-underline hover:text-foreground"
        >
          <BrandMark />
          <span className="text-sm font-semibold tracking-tight">
            Escenarios Colombia
          </span>
        </Link>
        <nav
          className="ml-auto flex max-w-full items-center gap-0.5 overflow-x-auto text-sm"
          aria-label="Principal"
        >
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-muted-foreground no-underline transition-colors hover:bg-accent hover:text-foreground",
                  active && "bg-accent text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
