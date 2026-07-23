import { cn } from "@/lib/utils";
import type { EvidenciaEstado, EvidenciaNivel } from "@/lib/types";

const NIVEL_LABEL: Record<EvidenciaNivel, string> = {
  insuficiente: "Evidencia insuficiente",
  contraste_parcial: "Contraste parcial",
  fundado: "Evidencia fundada",
};

const ESTADO_LABEL: Record<EvidenciaEstado, string> = {
  candidato: "candidato",
  contrastado: "contrastado",
  fundado: "fundado",
  en_conflicto: "en conflicto",
  rechazado: "rechazado",
};

export function EvidenciaNivelBadge({
  nivel,
  className,
}: {
  nivel?: EvidenciaNivel | string | null;
  className?: string;
}) {
  const n = (nivel || "insuficiente") as EvidenciaNivel;
  const label = NIVEL_LABEL[n] || String(nivel);
  return (
    <span
      className={cn(
        "inline-flex border border-border px-2 py-0.5 text-xs tracking-wide",
        n === "fundado" && "border-iris text-iris",
        n === "contraste_parcial" && "text-bone",
        n === "insuficiente" && "text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}

export function EvidenciaEstadoBadge({
  estado,
  className,
}: {
  estado?: EvidenciaEstado | string | null;
  className?: string;
}) {
  const e = (estado || "candidato") as EvidenciaEstado;
  return (
    <span
      className={cn(
        "font-mono text-xs text-muted-foreground",
        e === "fundado" && "text-iris",
        e === "contrastado" && "text-bone",
        e === "rechazado" && "text-warn",
        e === "en_conflicto" && "text-warn",
        className,
      )}
    >
      {ESTADO_LABEL[e] || String(estado)}
    </span>
  );
}
