"use client";

import Link from "next/link";
import type { Alerta, Caso } from "@/lib/types";
import { useLiveCasos } from "@/components/LiveCasos";

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

  return (
    <>
      <p className="muted" style={{ fontSize: "0.85rem" }}>
        Fuente de datos: <strong>{source}</strong>
      </p>

      <h2>Discurso identidad</h2>
      <div className="grid">
        {identidad.length === 0 && <p className="muted">Ninguno marcado.</p>}
        {identidad.map((c) => (
          <Link key={c.id} href={`/casos/${c.id}`} className="panel">
            <span className="badge identidad">identidad</span>
            <div>{c.titulo}</div>
            <div className="score">{c.credibilidad}%</div>
            <div className="muted">factibilidad: {c.factibilidad}</div>
          </Link>
        ))}
      </div>

      <h2>Top credibilidad</h2>
      <div className="grid">
        {topCred.map((c) => (
          <Link key={c.id} href={`/casos/${c.id}`} className="panel">
            {c.discurso_identidad && (
              <span className="badge identidad">identidad</span>
            )}
            <div>{c.titulo}</div>
            <div className="score">{c.credibilidad}%</div>
            <div className="bar">
              <span style={{ width: `${c.credibilidad}%` }} />
            </div>
          </Link>
        ))}
      </div>

      <h2>Alertas</h2>
      <div className="grid">
        {alertas.map((a) => (
          <div key={a.id} className="panel">
            <span className="badge warn">{a.tipo}</span>
            <div>{a.mensaje}</div>
            <Link href={`/casos/${a.caso_id}`}>{a.caso_id}</Link>
          </div>
        ))}
      </div>

      <h2>Gaps</h2>
      <p>
        {gapsCount} caso(s) con campos pendientes.{" "}
        <Link href="/gaps">Revisar →</Link>
      </p>
    </>
  );
}
