"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Alerta, Caso } from "@/lib/types";
import { useLiveCasos } from "@/components/LiveCasos";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { CrossCell, CrossGrid, CrossRow } from "@/components/CrossGrid";
import { useMotionPresets } from "@/components/motion";
import { focusRingInline } from "@/lib/focus";
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
  const { stagger, item } = useMotionPresets();
  const container = stagger(0.04);
  const ranking = buildRanking(identidad, topCred);

  return (
    <div className="space-y-12">
      <CrossGrid cols={4}>
        <CrossCell>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Identidad
          </p>
          <p className="score-mono mt-2 text-3xl">{identidad.length}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Casos con discurso identidad
          </p>
        </CrossCell>
        <CrossCell>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Top credibilidad
          </p>
          <p className="score-mono mt-2 text-3xl">
            {topCred[0] ? (
              <>
                <AnimatedNumber value={topCred[0].credibilidad} suffix="%" />
              </>
            ) : (
              "—"
            )}
          </p>
          <p className="mt-2 truncate text-xs text-muted-foreground">
            {topCred[0]?.titulo ?? "Sin casos"}
          </p>
        </CrossCell>
        <CrossCell>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Alertas
          </p>
          <p className="score-mono mt-2 text-3xl">{alertas.length}</p>
          <p className="mt-2 text-xs text-muted-foreground">Señales activas</p>
        </CrossCell>
        <CrossCell>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Gaps
          </p>
          <p className="score-mono mt-2 text-3xl">{gapsCount}</p>
          <p className="mt-2 text-xs text-muted-foreground">
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
          <CrossRow>
            <p className="col-span-full text-sm text-muted-foreground">
              Sin casos en ranking.
            </p>
          </CrossRow>
        ) : (
          ranking.map((c) => (
            <CrossRow key={c.id}>
              <div className="min-w-0">
                <Link
                  href={`/casos/${c.id}`}
                  className={cn(
                    "block text-sm text-white no-underline hover:text-iris-glow",
                    focusRingInline,
                  )}
                >
                  {c.titulo}
                </Link>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {c.discurso_identidad ? "identidad · " : ""}
                  factibilidad: {c.factibilidad}
                </p>
              </div>
              <AnimatedNumber
                value={c.credibilidad}
                suffix="%"
                className="text-xl"
              />
              <span className="font-mono text-[11px] text-muted-foreground">
                cred.
              </span>
            </CrossRow>
          ))
        )}
      </CrossGrid>

      <p className="font-mono text-[11px] text-muted-foreground">
        Fuente de datos: <span className="text-bone">{source}</span>
      </p>

      <section>
        <h2 className="mb-4 text-sm font-medium tracking-tight text-white">
          Alertas
        </h2>
        {alertas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin alertas.</p>
        ) : (
          <motion.ul
            className="divide-y divide-border border-y border-border"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {alertas.map((a) => (
              <motion.li
                key={a.id}
                variants={item}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3"
              >
                <span className="font-mono text-[11px] text-warn">{a.tipo}</span>
                <span className="text-sm text-bone">{a.mensaje}</span>
                <Link
                  href={`/casos/${a.caso_id}`}
                  className={cn(
                    "font-mono text-[11px] text-iris no-underline hover:text-iris-glow",
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
