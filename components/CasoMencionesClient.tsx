"use client";

import { ExternalLink } from "lucide-react";
import { useLiveMenciones } from "@/components/LiveMenciones";
import {
  EvidenciaEstadoBadge,
} from "@/components/EvidenciaBadge";
import type { Mencion } from "@/lib/types";
import { focusRingInline } from "@/lib/focus";
import { useCountryPath } from "@/lib/useCountryPath";
import { cn } from "@/lib/utils";
import { isCreditableEstado } from "@/lib/evidencia";

export function CasoMencionesClient({
  casoId,
  initial,
}: {
  casoId: string;
  initial: Mencion[];
}) {
  const { countryId } = useCountryPath();
  const { menciones, source } = useLiveMenciones(initial, {
    casoId,
    countryId,
  });

  const visible = menciones.filter(
    (m) =>
      m.evidencia_estado !== "rechazado" &&
      !String(m.url || "").includes("example.com") &&
      m.workflow_id !== "wf-test-ingest",
  );
  const credibles = visible.filter((m) =>
    isCreditableEstado(m.evidencia_estado),
  );
  const candidatos = visible.filter(
    (m) => (m.evidencia_estado || "candidato") === "candidato",
  );

  return (
    <section>
      <h2 className="mb-1 text-base font-medium tracking-tight text-white">
        Menciones y fuentes
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Datos: <span className="text-bone">{source}</span> · {credibles.length}{" "}
        credibles · {candidatos.length} en cuarentena (candidato)
      </p>
      {visible.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin menciones.</p>
      )}
      <ul className="space-y-6">
        {visible
          .slice()
          .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
          .map((m) => (
            <li key={m.id}>
              <p className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="text-iris">{m.tipo_pieza}</span>
                <span className="text-border">·</span>
                {m.fecha}
                <span className="text-border">·</span>
                <EvidenciaEstadoBadge estado={m.evidencia_estado} />
                {m.fuente_linea ? (
                  <>
                    <span className="text-border">·</span>
                    <span className="font-mono text-xs">{m.fuente_linea}</span>
                  </>
                ) : null}
              </p>
              <blockquote className="border-l border-border pl-4 text-base leading-relaxed text-bone">
                {m.cita_corta}
              </blockquote>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pl-4">
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
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
                <code className="max-w-full truncate font-mono text-xs text-iris">
                  {m.url}
                </code>
              </div>
              <p className="mt-1 pl-4 text-xs text-muted-foreground">
                {m.workflow_id} · {m.id}
                {m.fuente_id ? ` · ${m.fuente_id}` : ""}
              </p>
            </li>
          ))}
      </ul>
    </section>
  );
}
