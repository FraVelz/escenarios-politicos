"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { BrandMark } from "@/components/BrandMark";
import { easeOut } from "@/components/motion";
import { focusRing, focusRingNav } from "@/lib/focus";
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
  const reduce = useReducedMotion();

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-[25px]"
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: easeOut }}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 rounded-none text-white no-underline hover:text-white",
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
          <span className="text-sm font-medium tracking-tight text-white">
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
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative rounded-none px-2.5 py-1.5 text-bone no-underline transition-colors duration-150 hover:bg-transparent hover:text-white",
                  focusRingNav,
                  active && "text-white",
                )}
              >
                {l.label}
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-primary/70 transition-[width] duration-150 ease-out group-hover:w-[calc(100%-1.25rem)]"
                />
                {active && (
                  <motion.span
                    layoutId={reduce ? undefined : "nav-active"}
                    aria-hidden
                    className="pointer-events-none absolute bottom-0.5 left-1/2 h-px w-[calc(100%-1.25rem)] -translate-x-1/2 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
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
