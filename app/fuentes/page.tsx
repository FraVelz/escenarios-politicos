import fs from "fs";
import path from "path";
import { FuentesMencionesClient } from "@/components/FuentesMencionesClient";
import { listCasosSync, listMencionesSync } from "@/lib/data";

export default function FuentesPage() {
  const file = path.join(process.cwd(), "docs/colombia/01-fuentes.md");
  const md = fs.readFileSync(file, "utf8");
  const casos = listCasosSync();
  const menciones = listMencionesSync();

  return (
    <main>
      <h1>Fuentes y menciones</h1>
      <p className="muted">
        Cada tema (caso) con sus citas y URL de origen. Lo que ingiere n8n aparece
        aquí cuando llega a Firestore.
      </p>

      <FuentesMencionesClient initialMenciones={menciones} casos={casos} />

      <h2 style={{ marginTop: "2.5rem" }}>Catálogo de fuentes (metodología)</h2>
      <article className="prose panel">
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{md}</pre>
      </article>
    </main>
  );
}
