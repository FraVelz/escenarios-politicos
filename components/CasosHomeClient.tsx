"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Alerta, Caso } from "@/lib/types";
import { useLiveCasos } from "@/components/LiveCasos";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { CrossCell, CrossGrid, CrossRow } from "@/components/CrossGrid";
import { Reveal, easeOut, useMotionPresets } from "@/components/motion";
import { focusRingInline } from "@/lib/focus";
import { SCORE_MONO } from "@/lib/styles";
import { cn } from "@/lib/utils";

function buildRanking(identidad: Caso[], topCred: Caso[]): Caso[] {
  const seen = new Set<string>();
  const out: Caso[] = [];
  for (const c of [...identidad, ...topCred]) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}

export function CasosHomeClient({
  initialCasos,
  identidad,
  topCred,
  alertas,
  gapsCount,
}: {
  initialCasos: Caso[];
  identidad: Caso[];
  topCred: Caso[];
  alertas: Alerta[];
  gapsCount: number;
}) {
  const { source } = useLiveCasos(initialCasos);
  const { stagger, itemBlur, fadeUp } = useMotionPresets();
  const reduce = useReducedMotion();
  const ranking = buildRanking(identidad, topCred);

  return (
    <div className="space-y-12">
      <CrossGrid
        cols={4}
        variants={stagger(0.07)}
        initial="hidden"
        animate="show"
      >
        <CrossCell variants={itemBlur}>
          <p className="text-sm text-muted-foreground">Identidad</p>
          <p className={cn(SCORE_MONO, "mt-2 text-3xl")}>{identidad.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Casos con discurso identidad
          </p>
        </CrossCell>
        <CrossCell variants={itemBlur}>
          <p className="text-sm text-muted-foreground">Top credibilidad</p>
          <p className={cn(SCORE_MONO, "mt-2 text-3xl")}>
            {topCred[0] ? (
              <AnimatedNumber value={topCred[0].credibilidad} suffix="%" />
            ) : (
              "—"
            )}
          </p>
          <p className="mt-2 truncate text-sm text-muted-foreground">
            {topCred[0]?.titulo ?? "Sin casos"}
          </p>
        </CrossCell>
        <CrossCell variants={itemBlur}>
          <p className="text-sm text-muted-foreground">Alertas</p>
          <p className={cn(SCORE_MONO, "mt-2 text-3xl")}>{alertas.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">Señales activas</p>
        </CrossCell>
        <CrossCell variants={itemBlur}>
          <p className="text-sm text-muted-foreground">Gaps</p>
          <p className={cn(SCORE_MONO, "mt-2 text-3xl")}>{gapsCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            <Link
              href="/gaps"
              className={cn(
                "text-muted-foreground no-underline hover:text-white",
                focusRingInline,
              )}
            >
              Revisar pendientes →
            </Link>
          </p>
        </CrossCell>

        {ranking.length === 0 ? (
          <CrossRow variants={itemBlur}>
            <p className="col-span-full text-sm text-muted-foreground">
              Sin casos en ranking.
            </p>
          </CrossRow>
        ) : (
          ranking.map((c) => (
            <CrossRow
              key={c.id}
              variants={itemBlur}
              whileHover={
                reduce
                  ? undefined
                  : { x: 2, transition: { duration: 0.15, ease: easeOut } }
              }
            >
              <div className="min-w-0">
                <Link
                  href={`/casos/${c.id}`}
                  className={cn(
                    "block text-base text-white no-underline hover:text-iris-glow",
                    focusRingInline,
                  )}
                >
                  {c.titulo}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.discurso_identidad ? "identidad · " : ""}
                  factibilidad: {c.factibilidad}
                </p>
              </div>
              <AnimatedNumber
                value={c.credibilidad}
                suffix="%"
                className="text-xl"
              />
              <span className="text-sm text-muted-foreground">cred.</span>
            </CrossRow>
          ))
        )}
      </CrossGrid>

      <Reveal delay={0.2} y={8} as="p" className="text-sm text-muted-foreground">
        Fuente de datos: <span className="text-bone">{source}</span>
      </Reveal>

      <section>
        <Reveal as="h2" delay={0.12} y={10} className="mb-4 text-base font-medium tracking-tight text-white">
          Alertas
        </Reveal>
        {alertas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin alertas.</p>
        ) : (
          <motion.ul
            className="divide-y divide-border border-y border-border"
            variants={stagger(0.06)}
            initial="hidden"
            animate="show"
          >
            {alertas.map((a) => (
              <motion.li
                key={a.id}
                variants={fadeUp}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3"
              >
                <span className="text-sm text-warn">{a.tipo}</span>
                <span className="text-base text-bone">{a.mensaje}</span>
                <Link
                  href={`/casos/${a.caso_id}`}
                  className={cn(
                    "text-sm text-iris no-underline hover:text-iris-glow",
                    focusRingInline,
                  )}
                >
                  → {a.caso_id}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </section>
    </div>
  );
}
