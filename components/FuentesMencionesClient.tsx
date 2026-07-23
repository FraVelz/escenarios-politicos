"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useLiveMenciones } from "@/components/LiveMenciones";
import { EvidenciaEstadoBadge } from "@/components/EvidenciaBadge";
import { areaLabel } from "@/lib/areas";
import type { Caso, Mencion } from "@/lib/types";
import { focusRingInline } from "@/lib/focus";
import { useCountryPath } from "@/lib/useCountryPath";
import { cn } from "@/lib/utils";

export function FuentesMencionesClient({
  initialMenciones,
  casos,
}: {
  initialMenciones: Mencion[];
  casos: Caso[];
}) {
  const { countryId, href } = useCountryPath();
  const { menciones, source } = useLiveMenciones(initialMenciones, {
    countryId,
  });
  const casoMap = Object.fromEntries(casos.map((c) => [c.id, c]));

  const filtered = menciones.filter(
    (m) =>
      m.evidencia_estado !== "rechazado" &&
      !String(m.url || "").includes("example.com") &&
      m.workflow_id !== "wf-test-ingest",
  );

  const byCaso: { caso: (typeof casos)[number]; items: typeof filtered }[] =
    [];
  for (const c of casos) {
    const items = filtered
      .filter((m) => m.caso_id === c.id)
      .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
    if (items.length > 0) byCaso.push({ caso: c, items });
  }

  const huerfanas = filtered.filter((m) => !casoMap[m.caso_id]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Menciones en vivo · fuente: <span className="text-bone">{source}</span> ·{" "}
        {filtered.length} registro{filtered.length === 1 ? "" : "s"} (sin
        rechazados/test)
      </p>

      <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="border border-border px-2 py-0.5">
          candidato = cuarentena
        </span>
        <span className="border border-border px-2 py-0.5">
          contrastado/fundado = cuenta en credibilidad
        </span>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {byCaso.map(({ caso, items }) => (
          <section
            key={caso.id}
            aria-labelledby={`caso-${caso.id}`}
            className="py-10 sm:py-12"
          >
            <h2
              id={`caso-${caso.id}`}
              className="mb-1.5 text-lg font-medium tracking-tight text-white"
            >
              <Link
                href={href(`/casos/${caso.id}`)}
                className={cn(
                  "text-white no-underline hover:text-iris-glow",
                  focusRingInline,
                )}
              >
                {caso.titulo}
              </Link>
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {areaLabel(caso.area)} · {items.length} mención
              {items.length === 1 ? "" : "es"} · cred. {caso.credibilidad}%
            </p>
            <ul className="space-y-8">
              {items.map((m) => (
                <li key={m.id}>
                  <p className="mb-2.5 text-sm text-muted-foreground">
                    <span className="text-iris">{m.tipo_pieza}</span>
                    <span className="mx-2 text-border">·</span>
                    {m.fecha}
                    <span className="mx-2 text-border">·</span>
                    <EvidenciaEstadoBadge estado={m.evidencia_estado} />
                    {m.fuente_linea ? (
                      <>
                        <span className="mx-2 text-border">·</span>
                        <span className="font-mono text-xs">{m.fuente_linea}</span>
                      </>
                    ) : null}
                  </p>
                  <blockquote className="border-l border-border pl-4 text-base leading-relaxed text-bone">
                    {m.cita_corta}
                  </blockquote>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 pl-4">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm text-smoke no-underline hover:text-white",
                        focusRingInline,
                      )}
                    >
                      Abrir fuente
                      <ExternalLink className="size-3.5" aria-hidden />
                      <span className="sr-only">
                        (se abre en una pestaña nueva)
                      </span>
                    </a>
                    <span className="max-w-full truncate font-mono text-xs text-iris">
                      {m.url}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {huerfanas.length > 0 && (
          <section className="py-10 sm:py-12">
            <h2 className="mb-6 text-base font-medium tracking-tight text-white">
              Sin caso vinculado
            </h2>
            <ul className="space-y-8">
              {huerfanas.map((m) => (
                <li key={m.id}>
                  <p className="mb-2.5 text-sm text-iris">caso_id: {m.caso_id}</p>
                  <blockquote className="border-l border-border pl-4 text-base text-bone">
                    {m.cita_corta}
                  </blockquote>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "mt-3 block break-all pl-4 font-mono text-xs text-iris",
                      focusRingInline,
                    )}
                  >
                    {m.url}
                    <span className="sr-only">
                      {" "}
                      (se abre en una pestaña nueva)
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {menciones.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No hay menciones todavía.
        </p>
      )}
    </div>
  );
}
