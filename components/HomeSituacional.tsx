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
  const topSenales = senales.slice(0, 2);

  return (
    <div className="space-y-14">
      <header className="space-y-3">
        <Reveal
          as="h1"
          className="max-w-3xl text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.1] md:tracking-[-0.03em]"
        >
          {paisNombre}
        </Reveal>
        <Reveal
          as="p"
          delay={0.06}
          y={12}
          className="max-w-2xl text-sm leading-relaxed text-muted-foreground"
        >
          {marco.pregunta_central}
        </Reveal>
      </header>

      <Reveal delay={0.08} className="max-w-2xl space-y-3">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {ESTADO_LABEL[marco.estado_acto]}
          {" · "}
          horizontes {marco.horizontes_dias.join("/")}d
        </p>
        <p className="text-lg leading-snug text-white sm:text-xl">
          {a.nombre}
          <span className="text-muted-foreground"> → </span>
          {b.nombre}
          {b.posesion_at ? (
            <span className="text-muted-foreground">
              {" "}
              · posesión{" "}
              <time dateTime={b.posesion_at}>{b.posesion_at}</time>
            </span>
          ) : null}
        </p>
        <Link
          href={href("/contexto")}
          className={cn(
            "inline-flex text-sm text-bone no-underline hover:text-white",
            focusRingInline,
          )}
        >
          Contexto y transición →
        </Link>
      </Reveal>

      {topSenales.length > 0 && (
        <section className="max-w-2xl">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium tracking-tight text-white">
              Señales
            </h2>
            {senales.length > 2 && (
              <Link
                href={href("/escenarios")}
                className={cn(
                  "text-xs text-muted-foreground no-underline hover:text-white",
                  focusRingInline,
                )}
              >
                Ver todas →
              </Link>
            )}
          </div>
          <ul className="space-y-4 border-t border-border pt-4">
            {topSenales.map((s) => (
              <li key={s.id}>
                <p className="text-base text-bone">{s.titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.detalle}</p>
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
