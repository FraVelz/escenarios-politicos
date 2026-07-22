"use client";

import { useLiveMenciones } from "@/components/LiveMenciones";
import type { Mencion } from "@/lib/types";

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
      <h2>Menciones y fuentes</h2>
      <p className="muted" style={{ fontSize: "0.85rem" }}>
        Datos: <strong>{source}</strong> · {menciones.length} mención
        {menciones.length === 1 ? "" : "es"}
      </p>
      {menciones.length === 0 && <p className="muted">Sin menciones.</p>}
      {menciones
        .slice()
        .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
        .map((m) => (
          <article key={m.id} className="panel" style={{ marginBottom: "0.75rem" }}>
            <div>
              <span className="badge">{m.tipo_pieza}</span>
              <span className="muted">{m.fecha}</span>
            </div>
            <blockquote style={{ margin: "0.5rem 0" }}>{m.cita_corta}</blockquote>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <a href={m.url} target="_blank" rel="noreferrer">
                Abrir fuente →
              </a>
              <code className="muted" style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
                {m.url}
              </code>
            </div>
            <div className="muted" style={{ fontSize: "0.75rem", marginTop: "0.35rem" }}>
              {m.workflow_id} · {m.id}
            </div>
          </article>
        ))}
    </section>
  );
}
