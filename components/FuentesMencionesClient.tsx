"use client";

import Link from "next/link";
import { useLiveMenciones } from "@/components/LiveMenciones";
import { areaLabel } from "@/lib/areas";
import type { Caso, Mencion } from "@/lib/types";

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
    <>
      <p className="muted" style={{ fontSize: "0.85rem" }}>
        Menciones en vivo · fuente de datos: <strong>{source}</strong> ·{" "}
        {menciones.length} registro{menciones.length === 1 ? "" : "s"}
      </p>

      {byCaso.map(({ caso, items }) => (
        <section key={caso.id} style={{ marginTop: "1.5rem" }}>
          <h2 style={{ marginBottom: "0.35rem" }}>
            <Link href={`/casos/${caso.id}`}>{caso.titulo}</Link>
          </h2>
          <p className="muted" style={{ marginTop: 0, fontSize: "0.85rem" }}>
            {areaLabel(caso.area)} · {items.length} mención
            {items.length === 1 ? "" : "es"} · cred. {caso.credibilidad}%
          </p>
          {items.map((m) => (
            <article key={m.id} className="panel" style={{ marginBottom: "0.65rem" }}>
              <div>
                <span className="badge">{m.tipo_pieza}</span>
                <span className="muted">{m.fecha}</span>
              </div>
              <blockquote style={{ margin: "0.45rem 0" }}>{m.cita_corta}</blockquote>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href={m.url} target="_blank" rel="noreferrer">
                  Abrir fuente →
                </a>
                <span className="muted" style={{ fontSize: "0.8rem" }}>
                  {m.url}
                </span>
              </div>
              <div className="muted" style={{ fontSize: "0.75rem", marginTop: "0.35rem" }}>
                workflow: {m.workflow_id} · id: {m.id}
              </div>
            </article>
          ))}
        </section>
      ))}

      {huerfanas.length > 0 && (
        <section style={{ marginTop: "1.5rem" }}>
          <h2>Sin caso vinculado</h2>
          {huerfanas.map((m) => (
            <article key={m.id} className="panel" style={{ marginBottom: "0.65rem" }}>
              <div className="badge">caso_id: {m.caso_id}</div>
              <blockquote>{m.cita_corta}</blockquote>
              <a href={m.url} target="_blank" rel="noreferrer">
                {m.url}
              </a>
            </article>
          ))}
        </section>
      )}

      {menciones.length === 0 && (
        <p className="muted">No hay menciones todavía.</p>
      )}
    </>
  );
}
