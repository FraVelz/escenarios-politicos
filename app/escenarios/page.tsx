import fs from "fs";
import path from "path";

export default function EscenariosPage() {
  const file = path.join(
    process.cwd(),
    "content/informes/colombia-2026-07-21.md",
  );
  const md = fs.readFileSync(file, "utf8");
  // Extraer sección 6 escenarios de forma simple
  const start = md.indexOf("## 6. Escenarios");
  const end = md.indexOf("## 7.");
  const chunk = start >= 0 ? md.slice(start, end > 0 ? end : undefined) : md;

  return (
    <main>
      <h1>Escenarios</h1>
      <p className="muted">
        Extraído del informe Colombia 2026-07-21. Credibilidad de casos ≠ probabilidad
        de escenario.
      </p>
      <article className="prose panel">
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{chunk}</pre>
      </article>
    </main>
  );
}
