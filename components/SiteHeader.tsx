"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { m, useReducedMotion } from "motion/react";
import { BrandMark } from "@/components/BrandMark";
import { CountrySwitcher } from "@/components/CountrySwitcher";
import { easeOut } from "@/lib/ease";
import {
  countryPath,
  defaultCountryIdSync,
  listAvailableCountriesSync,
} from "@/lib/countries";
import { useCountryPath } from "@/lib/useCountryPath";
import { focusRing, focusRingNav } from "@/lib/focus";
import { cn } from "@/lib/utils";
import type { PaisMeta } from "@/lib/types";

/** Primarios: pocas rutas. El resto en “Más”. */
const PRIMARY: { path: string; label: string }[] = [
  { path: "/contexto", label: "Contexto" },
  { path: "/poder", label: "Poder" },
  { path: "/casos", label: "Casos" },
  { path: "/escenarios", label: "Escenarios" },
  { path: "/fuentes", label: "Fuentes" },
];

const MORE: { path: string; label: string; global?: boolean }[] = [
  { path: "/partidos", label: "Partidos" },
  { path: "/actores", label: "Actores" },
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

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreMenuId = useId();

  function navHref(path: string, global?: boolean): string {
    if (global) return path;
    if (countryId) return href(path);
    if (effectiveCountry) return countryPath(effectiveCountry, path);
    return path || "/";
  }

  function isActive(path: string, global?: boolean): boolean {
    const target = navHref(path, global);
    if (global) {
      return pathname === path || pathname.startsWith(`${path}/`);
    }
    return pathname === target || pathname.startsWith(`${target}/`);
  }

  const moreActive = MORE.some((item) => isActive(item.path, item.global));

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  return (
    <m.header
      className="sticky top-0 z-40 border-b border-border bg-black/95 backdrop-blur-[25px]"
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: easeOut }}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={effectiveCountry ? countryPath(effectiveCountry) : "/"}
          className={cn(
            "flex shrink-0 items-center gap-2.5 rounded-none text-white no-underline hover:text-white",
            focusRing,
          )}
        >
          <m.span
            className="inline-flex"
            whileHover={reduce ? undefined : { scale: 1.05 }}
            whileTap={reduce ? undefined : { scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            <BrandMark />
          </m.span>
          <span className="text-sm font-medium tracking-tight text-white">
            Escenarios
            {activePais ? (
              <span className="text-muted-foreground">
                {" "}
                · {activePais.nombre_corto}
              </span>
            ) : null}
          </span>
        </Link>

        <CountrySwitcher initial={available} />

        <nav
          className="ml-auto flex min-w-0 items-center gap-0.5 text-sm"
          aria-label="Principal"
        >
          <div className="flex max-w-full items-center gap-0.5 overflow-x-auto">
            {PRIMARY.map((l) => {
              const target = navHref(l.path);
              const active = isActive(l.path);
              return (
                <Link
                  key={l.label}
                  href={target}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative shrink-0 rounded-none px-2.5 py-1.5 text-bone no-underline transition-colors duration-150 hover:text-white",
                    focusRingNav,
                    active && "text-white",
                  )}
                >
                  {l.label}
                  {active && (
                    <m.span
                      layoutId={reduce ? undefined : "nav-active"}
                      aria-hidden
                      className="pointer-events-none absolute bottom-0.5 left-1/2 h-px w-[calc(100%-1.25rem)] -translate-x-1/2 bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 34,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div ref={moreRef} className="relative shrink-0">
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              aria-controls={moreMenuId}
              onClick={() => setMoreOpen((o) => !o)}
              className={cn(
                "rounded-none px-2.5 py-1.5 text-bone transition-colors duration-150 hover:text-white",
                focusRingNav,
                (moreOpen || moreActive) && "text-white",
              )}
            >
              Más
            </button>
            {moreOpen && (
              <div
                id={moreMenuId}
                role="menu"
                className="absolute right-0 top-full z-50 mt-1 min-w-[10rem] border border-border bg-black py-1"
              >
                {MORE.map((item) => (
                  <Link
                    key={item.label}
                    role="menuitem"
                    href={navHref(item.path, item.global)}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "block px-3 py-2 text-sm text-bone no-underline hover:bg-white/5 hover:text-white",
                      focusRingNav,
                      isActive(item.path, item.global) && "text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </m.header>
  );
}
