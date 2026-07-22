import fs from "fs";
import path from "path";

export const PLAYBOOK_FILES = [
  "00-indice.md",
  "01-acto-y-casos.md",
  "02-discurso-de-campana.md",
  "03-estructurar-datos.md",
  "04-investigar.md",
  "05-escenarios-y-senales.md",
  "06-checklist-revision.md",
] as const;

export function readPlaybook(slug: string): string | null {
  const safe = PLAYBOOK_FILES.find((f) => f.replace(/\.md$/, "") === slug);
  if (!safe) return null;
  return fs.readFileSync(path.join(process.cwd(), "docs/playbook", safe), "utf8");
}
