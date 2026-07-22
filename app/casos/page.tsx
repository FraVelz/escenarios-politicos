import Link from "next/link";
import { listCasosSync } from "@/lib/data";

export default function CasosPage() {
  const casos = [...listCasosSync()].sort((a, b) => b.credibilidad - a.credibilidad);

  return (
    <main>
      <h1>Casos</h1>
      <p className="muted">
        Matriz frecuencia × factibilidad (credibilidad en columna). Ordenados por
        credibilidad %.
      </p>
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
                </td>
                <td>
                  <strong>{c.credibilidad}</strong>
                </td>
                <td>{c.n_menciones}</td>
                <td>{c.especificidad}</td>
                <td>{c.importancia}</td>
                <td>{c.factibilidad}</td>
                <td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
