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

export type PlaybookFile = (typeof PLAYBOOK_FILES)[number];

export function playbookSlug(file: string): string {
  return file.replace(/\.md$/, "");
}

/** Título legible a partir del nombre de archivo */
export function playbookLabel(file: string): string {
  const base = playbookSlug(file).replace(/^\d+-/, "");
  return base
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function readPlaybook(slug: string): string | null {
  const safe = PLAYBOOK_FILES.find((f) => playbookSlug(f) === slug);
  if (!safe) return null;
  return fs.readFileSync(
    path.join(process.cwd(), "docs/playbook", safe),
    "utf8",
  );
}

export function defaultPlaybookSlug(): string {
  return playbookSlug(PLAYBOOK_FILES[0]);
}
