"use client";

import { ExternalLink } from "lucide-react";
import { useLiveMenciones } from "@/components/LiveMenciones";
import type { Mencion } from "@/lib/types";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

export function CasoMencionesClient({
  casoId,
  initial,
}: {
  casoId: string;
  initial: Mencion[];
}) {
  const { menciones, source } = useLiveMenciones(initial, casoId);

  return (
    <section>
      <h2 className="mb-1 text-sm font-medium tracking-tight text-white">
        Menciones y fuentes
      </h2>
      <p className="mb-6 font-mono text-[11px] text-muted-foreground">
        Datos: <span className="text-bone">{source}</span> · {menciones.length}{" "}
        mención
        {menciones.length === 1 ? "" : "es"}
      </p>
      {menciones.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin menciones.</p>
      )}
      <ul className="space-y-6">
        {menciones
          .slice()
          .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
          .map((m) => (
            <li key={m.id}>
              <p className="mb-2 font-mono text-[11px] text-muted-foreground">
                <span className="text-iris">{m.tipo_pieza}</span>
                <span className="mx-2 text-border">·</span>
                {m.fecha}
              </p>
              <blockquote className="border-l border-border pl-4 text-sm leading-relaxed text-bone">
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
                <code className="max-w-full truncate font-mono text-[11px] text-iris">
                  {m.url}
                </code>
              </div>
              <p className="mt-1 pl-4 font-mono text-[10px] text-muted-foreground">
                {m.workflow_id} · {m.id}
              </p>
            </li>
          ))}
      </ul>
    </section>
  );
}
