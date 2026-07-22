import fs from "fs";
import path from "path";

export default function FuentesPage() {
  const file = path.join(process.cwd(), "docs/colombia/01-fuentes.md");
  const md = fs.readFileSync(file, "utf8");
  return (
    <main>
      <h1>Fuentes</h1>
      <article className="prose panel">
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{md}</pre>
      </article>
    </main>
  );
}
