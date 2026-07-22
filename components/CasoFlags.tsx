import type { Caso } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function CasoFlags({ c }: { c: Caso }) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {c.discurso_identidad && (
        <Badge variant="identidad">identidad</Badge>
      )}
      {c.n_menciones >= 10 && c.especificidad < 20 && (
        <Badge variant="danger">ruido</Badge>
      )}
      {c.n_menciones <= 1 && c.importancia === "alta" && (
        <Badge variant="warn">raro/importante</Badge>
      )}
      {c.credibilidad >= 60 && c.factibilidad === "baja" && (
        <Badge variant="danger">relato≠capacidad</Badge>
      )}
    </span>
  );
}
