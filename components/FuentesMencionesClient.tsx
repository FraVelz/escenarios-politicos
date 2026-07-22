"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useLiveMenciones } from "@/components/LiveMenciones";
import { areaLabel } from "@/lib/areas";
import type { Caso, Mencion } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export function FuentesMencionesClient({
  initialMenciones,
  casos,
}: {
  initialMenciones: Mencion[];
  casos: Caso[];
}) {
  const { menciones, source } = useLiveMenciones(initialMenciones);
  const casoMap = Object.fromEntries(casos.map((c) => [c.id, c]));

  const byCaso = casos
    .map((c) => ({
      caso: c,
      items: menciones
        .filter((m) => m.caso_id === c.id)
        .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha))),
    }))
    .filter((g) => g.items.length > 0);

  const huerfanas = menciones.filter((m) => !casoMap[m.caso_id]);

  return (
    <div className="space-y-8">
      <p className="text-xs text-muted-foreground">
        Menciones en vivo · fuente de datos:{" "}
        <span className="font-medium text-foreground">{source}</span> ·{" "}
        {menciones.length} registro{menciones.length === 1 ? "" : "s"}
      </p>

      {byCaso.map(({ caso, items }) => (
        <section key={caso.id}>
          <h2 className="mb-1 text-lg font-semibold tracking-tight">
            <Link
              href={`/casos/${caso.id}`}
              className="text-foreground no-underline hover:text-primary"
            >
              {caso.titulo}
            </Link>
          </h2>
          <p className="mb-3 text-xs text-muted-foreground">
            {areaLabel(caso.area)} · {items.length} mención
            {items.length === 1 ? "" : "es"} · cred. {caso.credibilidad}%
          </p>
          <div className="space-y-3">
            {items.map((m) => (
              <Card key={m.id}>
                <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
                  <Badge>{m.tipo_pieza}</Badge>
                  <span className="text-xs text-muted-foreground">{m.fecha}</span>
                </CardHeader>
                <CardContent className="space-y-2">
                  <blockquote className="border-l-2 border-primary/40 pl-3 text-sm leading-relaxed">
                    {m.cita_corta}
                  </blockquote>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm no-underline hover:underline"
                    >
                      Abrir fuente
                      <ExternalLink className="size-3.5" />
                    </a>
                    <span className="max-w-full truncate font-mono text-[11px] text-muted-foreground">
                      {m.url}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    workflow: {m.workflow_id} · id: {m.id}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {huerfanas.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold tracking-tight">
            Sin caso vinculado
          </h2>
          <div className="space-y-3">
            {huerfanas.map((m) => (
              <Card key={m.id}>
                <CardHeader>
                  <Badge>caso_id: {m.caso_id}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <blockquote className="border-l-2 border-border pl-3 text-sm">
                    {m.cita_corta}
                  </blockquote>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sm"
                  >
                    {m.url}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {menciones.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No hay menciones todavía.
        </p>
      )}
    </div>
  );
}
