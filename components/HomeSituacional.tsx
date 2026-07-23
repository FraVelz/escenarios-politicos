"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion";
import { CasosHomeClient } from "@/components/CasosHomeClient";
import { useCountryPath } from "@/lib/useCountryPath";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";
import type { Alerta, Caso, MarcoPolitico, SenalSeed } from "@/lib/types";

const ESTADO_LABEL: Record<MarcoPolitico["estado_acto"], string> = {
  gobierno_estable: "Gobierno estable",
  transicion_pre_posesion: "Transición — posesión pendiente",
  post_transicion_reciente: "Post-transición reciente",
  sin_sucesor_conocido: "Sin sucesor conocido",
};

export function HomeSituacional({
  paisNombre,
  marco,
  identidad,
  topCred,
  alertas,
  gapsCount,
  senales,
  casos,
}: {
  paisNombre: string;
  marco: MarcoPolitico;
  identidad: Caso[];
  topCred: Caso[];
  alertas: Alerta[];
  gapsCount: number;
  senales: SenalSeed[];
  casos: Caso[];
}) {
  const { href } = useCountryPath();
  const a = marco.presidente_ejercicio;
  const b = marco.presidente_electo_o_sucesor;

  return (
    <div className="space-y-12">
      <header className="space-y-5">
        <Reveal
          as="p"
          className="text-xs uppercase tracking-[0.14em] text-muted-foreground"
        >
          Mesa situacional · discurso + poder + escenarios
        </Reveal>
        <Reveal
          as="h1"
          delay={0.04}
          className="max-w-3xl text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.1] md:tracking-[-0.03em]"
        >
          {paisNombre}
        </Reveal>
        <Reveal
          as="p"
          delay={0.08}
          y={14}
          className="max-w-2xl text-sm leading-relaxed text-muted-foreground"
        >
          {marco.pregunta_central}
        </Reveal>
      </header>

      <Reveal
        delay={0.1}
        className="border border-border bg-black/80 px-4 py-4 sm:px-5"
      >
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Acto · {ESTADO_LABEL[marco.estado_acto]}
        </p>
        <p className="mt-2 text-base text-bone">
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
        <p className="mt-2 text-sm text-muted-foreground">
          Horizontes: {marco.horizontes_dias.join(" / ")} días
        </p>
        <Link
          href={href("/contexto")}
          className={cn(
            "mt-3 inline-flex text-sm text-bone no-underline hover:text-white",
            focusRingInline,
          )}
        >
          Ver contexto y transición →
        </Link>
      </Reveal>

      <nav aria-label="Módulos de análisis" className="flex flex-wrap gap-x-5 gap-y-2">
        {[
          ["/poder", "Poder"],
          ["/partidos", "Partidos"],
          ["/actores", "Actores"],
          ["/escenarios", "Escenarios"],
          ["/casos", "Casos"],
          ["/gaps", "Gaps"],
        ].map(([path, label]) => (
          <Link
            key={path}
            href={href(path)}
            className={cn(
              "text-sm text-smoke no-underline hover:text-white",
              focusRingInline,
            )}
          >
            {label} →
          </Link>
        ))}
      </nav>

      {senales.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-medium tracking-tight text-white">
            Señales
          </h2>
          <ul className="divide-y divide-border border-y border-border">
            {senales.map((s) => (
              <li key={s.id} className="py-3">
                <p className="text-base text-white">{s.titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.detalle}</p>
                {s.fuente_url ? (
                  <a
                    href={s.fuente_url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "mt-1 inline-block text-xs text-iris no-underline hover:text-iris-glow",
                      focusRingInline,
                    )}
                  >
                    Fuente →
                  </a>
                ) : (
                  <span className="mt-1 inline-block text-xs text-muted-foreground">
                    Fuente: N/D
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <CasosHomeClient
        initialCasos={casos}
        identidad={identidad}
        topCred={topCred}
        alertas={alertas}
        gapsCount={gapsCount}
      />
    </div>
  );
}
