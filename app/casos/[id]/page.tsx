import Link from "next/link";
import { notFound } from "next/navigation";
import { getCasoSync, listMencionesSync } from "@/lib/data";

export default async function CasoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caso = getCasoSync(id);
  if (!caso) notFound();
  const menciones = listMencionesSync(id);
  const d = caso.credibilidad_desglose;

  return (
    <main>
      <p>
        <Link href="/casos">← Casos</Link>
      </p>
      <h1>{caso.titulo}</h1>
      {caso.discurso_identidad && (
        <span className="badge identidad">discurso identidad</span>
      )}
      <span className="badge">{caso.fase}</span>
      <span className="badge">revisión: {caso.revision}</span>

      <div className="grid" style={{ marginTop: "1.25rem" }}>
        <div className="panel">
          <div className="muted">Credibilidad</div>
          <div className="score">{caso.credibilidad}%</div>
          <div className="bar">
            <span style={{ width: `${caso.credibilidad}%` }} />
          </div>
          <ul className="muted" style={{ paddingLeft: "1.1rem" }}>
            <li>especificidad: {d.especificidad} (peso 45%)</li>
            <li>repetición_norm: {d.repeticion_norm} (peso 25%)</li>
            <li>centralidad: {d.centralidad} (peso 30%)</li>
          </ul>
        </div>
        <div className="panel">
          <div>Menciones: {caso.n_menciones}</div>
          <div>Especificidad: {caso.especificidad}</div>
          <div>Importancia: {caso.importancia}</div>
          <div>Factibilidad: {caso.factibilidad}</div>
          <div>Función: {caso.funcion_retorica ?? "N/D"}</div>
        </div>
      </div>

      {caso.notas && (
        <p className="muted" style={{ marginTop: "1rem" }}>
          {caso.notas}
        </p>
      )}

      <h2>Menciones</h2>
      {menciones.length === 0 && <p className="muted">Sin menciones.</p>}
      {menciones.map((m) => (
        <div key={m.id} className="panel" style={{ marginBottom: "0.75rem" }}>
          <div className="badge">{m.tipo_pieza}</div>
          <div className="muted">{m.fecha}</div>
          <blockquote style={{ margin: "0.5rem 0" }}>{m.cita_corta}</blockquote>
          <a href={m.url} target="_blank" rel="noreferrer">
            Fuente
          </a>
        </div>
      ))}
    </main>
  );
}
