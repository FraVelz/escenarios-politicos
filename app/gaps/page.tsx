import Link from "next/link";
import { gapsFromCasos, listCasosSync } from "@/lib/data";

export default function GapsPage() {
  const gaps = gapsFromCasos(listCasosSync());

  return (
    <main>
      <h1>Gaps / campos pendientes</h1>
      <p className="muted">
        Nada se omite: lo incompleto aparece aquí como <code>N/D</code> o lista de
        pendientes.
      </p>
      {gaps.length === 0 && <p>Sin gaps.</p>}
      <div className="grid">
        {gaps.map((g) => (
          <div key={g.caso_id} className="panel">
            <Link href={`/casos/${g.caso_id}`}>{g.caso_id}</Link>
            <ul>
              {g.campos.map((c) => (
                <li key={c}>
                  <span className="badge warn">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
