"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import type { Alerta, Caso } from "@/lib/types";
import { useLiveCasos } from "@/components/LiveCasos";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Reveal, useMotionPresets } from "@/components/motion";
import { easeOut } from "@/lib/ease";
import { focusRingInline } from "@/lib/focus";
import { useCountryPath } from "@/lib/useCountryPath";
import { cn } from "@/lib/utils";

function buildRanking(casos: Caso[]): Caso[] {
  const identidad = casos.filter((c) => c.discurso_identidad);
  const topCred = [...casos]
    .sort((a, b) => b.credibilidad - a.credibilidad)
    .slice(0, 5);
  const seen = new Set<string>();
  const out: Caso[] = [];
  for (const c of [...identidad, ...topCred]) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out.slice(0, 5);
}

export function CasosHomeClient({
  initialCasos,
  identidad: identidadSeed,
  topCred: topCredSeed,
  alertas,
  gapsCount,
  /** Si true, omite alertas (el padre las renderiza a ancho completo). */
  hideAlertas = false,
}: {
  initialCasos: Caso[];
  identidad: Caso[];
  topCred: Caso[];
  alertas: Alerta[];
  gapsCount: number;
  hideAlertas?: boolean;
}) {
  const { countryId, href } = useCountryPath();
  const { casos, source } = useLiveCasos(initialCasos, countryId);
  const { stagger, fadeUp } = useMotionPresets();
  const reduce = useReducedMotion();

  const ranking =
    source === "firestore"
      ? buildRanking(casos)
      : buildRanking([
          ...identidadSeed,
          ...topCredSeed.filter(
            (c) => !identidadSeed.some((i) => i.id === c.id),
          ),
        ]);

  const identidadCount =
    source === "firestore"
      ? casos.filter((c) => c.discurso_identidad).length
      : identidadSeed.length;
  const topPct =
    source === "firestore"
      ? [...casos].sort((a, b) => b.credibilidad - a.credibilidad)[0]
          ?.credibilidad
      : topCredSeed[0]?.credibilidad;

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground">
        {identidadCount} identidad
        {topPct != null ? ` · top ${topPct}%` : ""}
        {alertas.length > 0 ? ` · ${alertas.length} alertas` : ""}
        {gapsCount > 0 ? (
          <>
            {" · "}
            <Link
              href={href("/gaps")}
              className={cn(
                "text-muted-foreground no-underline hover:text-white",
                focusRingInline,
              )}
            >
              {gapsCount} gaps
            </Link>
          </>
        ) : null}
        <span className="text-border"> · </span>
        <span className="text-smoke">{source}</span>
      </p>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium tracking-tight text-white">
            Relatos críticos
          </h2>
          <Link
            href={href("/casos")}
            className={cn(
              "text-xs text-muted-foreground no-underline hover:text-white",
              focusRingInline,
            )}
          >
            Todos →
          </Link>
        </div>
        {ranking.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin casos.</p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {ranking.map((c) => (
              <li key={c.id}>
                <m.div
                  className="flex items-baseline justify-between gap-4 py-3"
                  whileHover={
                    reduce
                      ? undefined
                      : { x: 2, transition: { duration: 0.15, ease: easeOut } }
                  }
                >
                  <div className="min-w-0">
                    <Link
                      href={href(`/casos/${c.id}`)}
                      className={cn(
                        "text-base text-white no-underline hover:text-iris-glow",
                        focusRingInline,
                      )}
                    >
                      {c.titulo}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {c.discurso_identidad ? "identidad · " : ""}
                      fact. {c.factibilidad}
                    </p>
                  </div>
                  <AnimatedNumber
                    value={c.credibilidad}
                    suffix="%"
                    className="shrink-0 text-lg"
                  />
                </m.div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {alertas.length > 0 && !hideAlertas && (
        <section>
          <Reveal
            as="h2"
            y={8}
            className="mb-3 text-sm font-medium tracking-tight text-white"
          >
            Alertas
          </Reveal>
          <m.ul
            className="space-y-3"
            variants={stagger(0.05)}
            initial="hidden"
            animate="show"
          >
            {alertas.map((a) => (
              <m.li key={a.id} variants={fadeUp} className="text-sm">
                <span className="text-warn">{a.tipo}</span>
                <span className="text-muted-foreground"> — </span>
                <span className="text-bone">{a.mensaje}</span>{" "}
                <Link
                  href={href(`/casos/${a.caso_id}`)}
                  className={cn(
                    "text-iris no-underline hover:text-iris-glow",
                    focusRingInline,
                  )}
                >
                  ver
                </Link>
              </m.li>
            ))}
          </m.ul>
        </section>
      )}
    </div>
  );
}

export function HomeAlertas({ alertas }: { alertas: Alerta[] }) {
  const { href } = useCountryPath();
  const { stagger, fadeUp } = useMotionPresets();

  if (alertas.length === 0) return null;

  return (
    <section>
      <Reveal
        as="h2"
        y={8}
        className="mb-3 text-sm font-medium tracking-tight text-white"
      >
        Alertas
      </Reveal>
      <m.ul
        className="grid gap-3 sm:grid-cols-2"
        variants={stagger(0.05)}
        initial="hidden"
        animate="show"
      >
        {alertas.map((a) => (
          <m.li
            key={a.id}
            variants={fadeUp}
            className="border-t border-border pt-3 text-sm"
          >
            <span className="text-warn">{a.tipo}</span>
            <span className="text-muted-foreground"> — </span>
            <span className="text-bone">{a.mensaje}</span>{" "}
            <Link
              href={href(`/casos/${a.caso_id}`)}
              className={cn(
                "text-iris no-underline hover:text-iris-glow",
                focusRingInline,
              )}
            >
              ver
            </Link>
          </m.li>
        ))}
      </m.ul>
    </section>
  );
}
