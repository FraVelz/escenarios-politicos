"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

export function HomeHero() {
  return (
    <header className="mb-10 space-y-4">
      <Reveal
        as="h1"
        className="max-w-3xl text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.1] md:tracking-[-0.03em]"
      >
        Colombia — casos y credibilidad
      </Reveal>
      <Reveal
        as="p"
        delay={0.08}
        y={14}
        className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]"
      >
        Credibilidad % = especificidad × repetición × centralidad (no es
        probabilidad de cumplimiento). Datos: Firestore + seed local.
      </Reveal>
      <Reveal delay={0.14} y={10}>
        <Link
          href="/casos"
          className={cn(
            "inline-flex text-sm text-bone no-underline hover:text-white",
            focusRingInline,
          )}
        >
          Ver todos los casos →
        </Link>
      </Reveal>
    </header>
  );
}
