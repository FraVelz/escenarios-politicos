import type { Caso } from "@/lib/types";

export function CasoFlags({ c }: { c: Caso }) {
  const flags: string[] = [];
  if (c.discurso_identidad) flags.push("identidad");
  if (c.n_menciones >= 10 && c.especificidad < 20) flags.push("ruido");
  if (c.n_menciones <= 1 && c.importancia === "alta")
    flags.push("raro/importante");
  if (c.credibilidad >= 60 && c.factibilidad === "baja")
    flags.push("relato≠capacidad");

  if (flags.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  return (
    <span className="text-sm text-muted-foreground">{flags.join(" · ")}</span>
  );
}
