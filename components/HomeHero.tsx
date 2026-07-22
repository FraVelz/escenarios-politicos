"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";
import type { MarcoPolitico } from "@/lib/types";

const ESTADO_LABEL: Record<MarcoPolitico["estado_acto"], string> = {
  gobierno_estable: "Gobierno estable",
  transicion_pre_posesion: "Transición — posesión pendiente",
  post_transicion_reciente: "Post-transición reciente",
  sin_sucesor_conocido: "Sin sucesor conocido",
};

export function HomeHero({ marco }: { marco: MarcoPolitico }) {
  const a = marco.presidente_ejercicio;
  const b = marco.presidente_electo_o_sucesor;

  return (
    <header className="mb-10 space-y-5">
      <Reveal
        as="p"
        className="text-xs uppercase tracking-[0.14em] text-muted-foreground"
      >
        Tipo de análisis · discurso + credibilidad % + escenarios
      </Reveal>
      <Reveal
        as="h1"
        delay={0.04}
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
        {marco.tipo_analisis}
      </Reveal>
      <Reveal
        delay={0.12}
        y={12}
        className="max-w-2xl border border-border bg-black/80 px-4 py-3 text-sm text-bone"
      >
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Acto · {ESTADO_LABEL[marco.estado_acto]}
        </p>
        <p className="mt-1.5">
          {a.nombre}{" "}
          <span className="text-muted-foreground">(en ejercicio)</span>
          {" → "}
          {b.nombre}{" "}
          <span className="text-muted-foreground">(electo)</span>
          {b.posesion_at ? (
            <>
              {" · posesión "}
              <time dateTime={b.posesion_at}>{b.posesion_at}</time>
            </>
          ) : null}
        </p>
      </Reveal>
      <Reveal delay={0.16} y={10} className="flex flex-wrap gap-x-5 gap-y-2">
        <Link
          href="/contexto"
          className={cn(
            "inline-flex text-sm text-bone no-underline hover:text-white",
            focusRingInline,
          )}
        >
          Ver contexto y transición →
        </Link>
        <Link
          href="/casos"
          className={cn(
            "inline-flex text-sm text-smoke no-underline hover:text-white",
            focusRingInline,
          )}
        >
          Ver todos los casos →
        </Link>
      </Reveal>
    </header>
  );
}
