import Link from "next/link";
import { AREA_ORDER, areaLabel } from "@/lib/areas";
import { listCasosSync } from "@/lib/data";
import type { Caso } from "@/lib/types";

function CasoFlags({ c }: { c: Caso }) {
  return (
    <>
      {c.discurso_identidad && (
        <span className="badge identidad">identidad</span>
      )}
      {c.n_menciones >= 10 && c.especificidad < 20 && (
        <span className="badge danger">ruido</span>
      )}
      {c.n_menciones <= 1 && c.importancia === "alta" && (
        <span className="badge warn">raro/importante</span>
      )}
      {c.credibilidad >= 60 && c.factibilidad === "baja" && (
        <span className="badge danger">relato≠capacidad</span>
      )}
    </>
  );
}

function CasosTable({ casos }: { casos: Caso[] }) {
  return (
    <div className="panel" style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Caso</th>
            <th>Cred.%</th>
            <th>Menciones</th>
            <th>Espec.</th>
            <th>Importancia</th>
            <th>Factibilidad</th>
            <th>Flags</th>
          </tr>
        </thead>
        <tbody>
          {casos.map((c) => (
            <tr key={c.id}>
              <td>
                <Link href={`/casos/${c.id}`}>{c.titulo}</Link>
                <div className="muted" style={{ fontSize: "0.75rem" }}>
                  <Link href="/fuentes">ver fuentes</Link>
                </div>
              </td>
              <td>
                <strong>{c.credibilidad}</strong>
              </td>
              <td>{c.n_menciones}</td>
              <td>{c.especificidad}</td>
              <td>{c.importancia}</td>
              <td>{c.factibilidad}</td>
              <td>
                <CasoFlags c={c} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CasosPage() {
  const all = listCasosSync();
  const byArea = AREA_ORDER.map((area) => ({
    area,
    casos: all
      .filter((c) => c.area === area)
      .sort((a, b) => b.credibilidad - a.credibilidad),
  })).filter((g) => g.casos.length > 0);

  const sinArea = all.filter((c) => !c.area || !AREA_ORDER.includes(c.area));

  return (
    <main>
      <h1>Casos</h1>
      <p className="muted">
        Agrupados por área. Dentro de cada área: credibilidad %, frecuencia y
        factibilidad.
      </p>
      <p className="muted" style={{ fontSize: "0.9rem" }}>
        {all.length} casos · {byArea.length} áreas
      </p>

      {byArea.map(({ area, casos }) => (
        <section key={area} style={{ marginTop: "1.75rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>{areaLabel(area)}</h2>
          <p className="muted" style={{ fontSize: "0.85rem", marginTop: 0 }}>
            {casos.length} caso{casos.length === 1 ? "" : "s"}
          </p>
          <CasosTable casos={casos} />
        </section>
      ))}

      {sinArea.length > 0 && (
        <section style={{ marginTop: "1.75rem" }}>
          <h2>Sin área</h2>
          <CasosTable
            casos={[...sinArea].sort((a, b) => b.credibilidad - a.credibilidad)}
          />
        </section>
      )}
    </main>
  );
}
