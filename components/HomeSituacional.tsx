"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion";
import { CasosHomeClient, HomeAlertas } from "@/components/CasosHomeClient";
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
  const topSenales = senales.slice(0, 4);

  return (
    <div className="space-y-12">
      <header className="grid gap-6 border-b border-border pb-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
        <div className="space-y-3">
          <Reveal
            as="h1"
            className="text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.1] md:tracking-[-0.03em]"
          >
            {paisNombre}
          </Reveal>
          <Reveal
            as="p"
            delay={0.06}
            y={12}
            className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]"
          >
            {marco.pregunta_central}
          </Reveal>
        </div>
        <Reveal delay={0.08} className="space-y-3 lg:text-right">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {ESTADO_LABEL[marco.estado_acto]}
            {" · "}
            horizontes {marco.horizontes_dias.join("/")}d
          </p>
          <p className="text-lg leading-snug text-white sm:text-xl">
            {a.nombre}
            <span className="text-muted-foreground"> → </span>
            {b.nombre}
          </p>
          {b.posesion_at ? (
            <p className="text-sm text-muted-foreground">
              posesión <time dateTime={b.posesion_at}>{b.posesion_at}</time>
            </p>
          ) : null}
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
      </header>

      <p className="border border-border px-4 py-3 text-sm text-muted-foreground">
        Piloto metodológico: las menciones seed están en cuarentena (
        <span className="text-bone">candidato</span>) hasta contraste
        multi-fuente. Credibilidad del relato ≠ probabilidad de cumplimiento.
        Ver <Link href={href("/gaps")} className="text-bone no-underline hover:text-white">/gaps</Link>{" "}
        y{" "}
        <Link href={href("/fuentes")} className="text-bone no-underline hover:text-white">/fuentes</Link>.
      </p>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {topSenales.length > 0 ? (
          <section>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-medium tracking-tight text-white">
                Señales
              </h2>
              {senales.length > 4 && (
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
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s.detalle}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section>
            <h2 className="mb-3 text-sm font-medium tracking-tight text-white">
              Señales
            </h2>
            <p className="border-t border-border pt-4 text-sm text-muted-foreground">
              N/D — sin señales cargadas.
            </p>
          </section>
        )}

        <CasosHomeClient
          initialCasos={casos}
          identidad={identidad}
          topCred={topCred}
          alertas={alertas}
          gapsCount={gapsCount}
          hideAlertas
        />
      </div>

      <HomeAlertas alertas={alertas} />
    </div>
  );
}
