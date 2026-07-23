"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { BrandMark } from "@/components/BrandMark";
import { CountrySwitcher } from "@/components/CountrySwitcher";
import { easeOut } from "@/components/motion";
import {
  countryPath,
  defaultCountryIdSync,
  listAvailableCountriesSync,
} from "@/lib/countries";
import { useCountryPath } from "@/lib/useCountryPath";
import { focusRing, focusRingNav } from "@/lib/focus";
import { cn } from "@/lib/utils";
import type { PaisMeta } from "@/lib/types";

const NAV_ITEMS: { path: string; label: string; global?: boolean }[] = [
  { path: "", label: "Inicio" },
  { path: "/contexto", label: "Contexto" },
  { path: "/poder", label: "Poder" },
  { path: "/partidos", label: "Partidos" },
  { path: "/actores", label: "Actores" },
  { path: "/casos", label: "Casos" },
  { path: "/escenarios", label: "Escenarios" },
  { path: "/fuentes", label: "Fuentes" },
  { path: "/gaps", label: "Gaps" },
  { path: "/playbook", label: "Playbook", global: true },
];

export function SiteHeader({ countries }: { countries?: PaisMeta[] }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { href, countryId } = useCountryPath();
  const available = countries ?? listAvailableCountriesSync();
  const effectiveCountry = countryId ?? defaultCountryIdSync();
  const activePais = available.find((p) => p.id === effectiveCountry);

  function navHref(path: string, global?: boolean): string {
    if (global) return path;
    if (countryId) return href(path);
    if (effectiveCountry) return countryPath(effectiveCountry, path);
    return path || "/";
  }

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-border bg-black/95 backdrop-blur-[25px]"
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: easeOut }}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href={effectiveCountry ? countryPath(effectiveCountry) : "/"}
          className={cn(
            "flex shrink-0 items-center gap-2.5 rounded-none text-white no-underline hover:text-white",
            focusRing,
          )}
        >
          <motion.span
            className="inline-flex"
            whileHover={reduce ? undefined : { scale: 1.05 }}
            whileTap={reduce ? undefined : { scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            <BrandMark />
          </motion.span>
          <span className="hidden text-sm font-medium tracking-tight text-white sm:inline">
            Escenarios
            {activePais ? ` ${activePais.nombre_corto}` : ""}
          </span>
        </Link>

        <CountrySwitcher initial={available} />

        <nav
          className="ml-auto flex max-w-full items-center gap-0.5 overflow-x-auto text-sm"
          aria-label="Principal"
        >
          {NAV_ITEMS.map((l) => {
            const target = navHref(l.path, l.global);
            const active = l.global
              ? pathname === l.path || pathname.startsWith(`${l.path}/`)
              : l.path === ""
                ? pathname === `/${effectiveCountry}` ||
                  pathname === `/${effectiveCountry}/`
                : pathname === target || pathname.startsWith(`${target}/`);
            return (
              <Link
                key={l.label}
                href={target}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative shrink-0 rounded-none px-2 py-1.5 text-bone no-underline transition-colors duration-150 hover:bg-transparent hover:text-white sm:px-2.5",
                  focusRingNav,
                  active && "text-white",
                )}
              >
                {l.label}
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-primary/70 transition-[width] duration-150 ease-out group-hover:w-[calc(100%-1rem)]"
                />
                {active && (
                  <motion.span
                    layoutId={reduce ? undefined : "nav-active"}
                    aria-hidden
                    className="pointer-events-none absolute bottom-0.5 left-1/2 h-px w-[calc(100%-1rem)] -translate-x-1/2 bg-primary"
                    transition={{ type: "spring", stiffness: 320, damping: 34 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
