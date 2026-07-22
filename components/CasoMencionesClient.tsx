"use client";

import { ExternalLink } from "lucide-react";
import { useLiveMenciones } from "@/components/LiveMenciones";
import type { Mencion } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      <h2 className="mb-1 text-lg font-semibold tracking-tight">
        Menciones y fuentes
      </h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Datos: <span className="font-medium text-foreground">{source}</span> ·{" "}
        {menciones.length} mención
        {menciones.length === 1 ? "" : "es"}
      </p>
      {menciones.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin menciones.</p>
      )}
      <div className="space-y-3">
        {menciones
          .slice()
          .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
          .map((m) => (
            <Card key={m.id}>
              <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
                <Badge>{m.tipo_pieza}</Badge>
                <span className="text-xs text-muted-foreground">{m.fecha}</span>
              </CardHeader>
              <CardContent className="space-y-2">
                <blockquote className="border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-foreground">
                  {m.cita_corta}
                </blockquote>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm no-underline hover:underline",
                    focusRingInline,
                  )}
                >
                  Abrir fuente
                  <ExternalLink className="size-3.5" aria-hidden />
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
                <code className="block break-all font-mono text-[11px] text-muted-foreground">
                  {m.url}
                </code>
                <p className="text-[11px] text-muted-foreground">
                  {m.workflow_id} · {m.id}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </section>
  );
}
