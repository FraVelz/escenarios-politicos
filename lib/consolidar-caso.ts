import {
  scoreEspecificidad,
  scoreRepeticion,
  type EspecificidadChecklist,
} from "./credibilidad";

type CasoLike = {
  especificidad?: number;
  especificidad_checklist?: EspecificidadChecklist;
  discurso_identidad?: boolean;
  credibilidad_desglose?: {
    especificidad: number;
    repeticion_norm: number;
    centralidad: number;
  };
  campos_pendientes?: string[];
};

type MencionLike = { fecha?: string | null };

/**
 * Recalcula n_menciones, fechas y credibilidad a partir del checklist del caso
 * y el conteo real de menciones. Conserva centralidad ya auditada.
 */
export function consolidarCasoFromMenciones(
  caso: CasoLike,
  menciones: MencionLike[],
): {
  n_menciones: number;
  primera_mencion_at: string | null;
  ultima_mencion_at: string | null;
  especificidad: number;
  credibilidad: number;
  credibilidad_desglose: {
    especificidad: number;
    repeticion_norm: number;
    centralidad: number;
  };
  campos_pendientes: string[];
  updated_at: string;
} {
  const n = menciones.length;
  const fechas = menciones
    .map((m) => m.fecha)
    .filter((f): f is string => typeof f === "string" && f.length > 0 && f !== "N/D")
    .sort();

  const especificidad = caso.especificidad_checklist
    ? scoreEspecificidad(caso.especificidad_checklist)
    : Number(caso.especificidad ?? 0);

  const repeticion_norm = scoreRepeticion(n);
  const centralidad =
    caso.credibilidad_desglose?.centralidad ??
    (caso.discurso_identidad ? 100 : 20);

  const credibilidad = Math.round(
    Math.min(
      100,
      Math.max(
        0,
        0.45 * especificidad + 0.25 * repeticion_norm + 0.3 * centralidad,
      ),
    ),
  );

  const pendientes = (caso.campos_pendientes ?? []).filter(
    (x) => x !== "recalcular_n_menciones",
  );

  return {
    n_menciones: n,
    primera_mencion_at: fechas[0] ?? null,
    ultima_mencion_at: fechas[fechas.length - 1] ?? null,
    especificidad,
    credibilidad,
    credibilidad_desglose: {
      especificidad,
      repeticion_norm,
      centralidad,
    },
    campos_pendientes: pendientes,
    updated_at: new Date().toISOString(),
  };
}
