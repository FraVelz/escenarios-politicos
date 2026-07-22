import Link from "next/link";
import { PLAYBOOK_FILES } from "@/lib/playbook";

export default function PlaybookIndexPage() {
  return (
    <main>
      <h1>Playbook Colombia</h1>
      <p className="muted">Manual del agente: datos, discurso, credibilidad, escenarios.</p>
      <ul>
        {PLAYBOOK_FILES.map((f) => (
          <li key={f}>
            <Link href={`/playbook/${f.replace(/\.md$/, "")}`}>{f}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
