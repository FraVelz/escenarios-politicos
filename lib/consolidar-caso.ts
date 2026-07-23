import {
  scoreEspecificidad,
  scoreRepeticion,
  type EspecificidadChecklist,
} from "./credibilidad";
import {
  computeEvidenciaEstadoForMencion,
  computeEvidenciaNivelCaso,
  isCreditableEstado,
  lineasFromMenciones,
  mergeChecklistFromFundado,
  type EvidenciaEstado,
  type EvidenciaNivel,
  type MencionEvidencia,
} from "./evidencia";

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

type MencionLike = MencionEvidencia & { fecha?: string | null };

export type ConsolidarCasoResult = {
  n_menciones: number;
  n_menciones_candidato: number;
  n_menciones_credibles: number;
  lineas_fuente: string[];
  evidencia_nivel: EvidenciaNivel;
  evidencia_resumen: string;
  primera_mencion_at: string | null;
  ultima_mencion_at: string | null;
  especificidad: number;
  especificidad_checklist: EspecificidadChecklist;
  credibilidad: number;
  credibilidad_desglose: {
    especificidad: number;
    repeticion_norm: number;
    centralidad: number;
  };
  campos_pendientes: string[];
  updated_at: string;
};

/**
 * Recalcula contadores y credibilidad.
 * repeticion_norm y n_menciones (fórmula) usan solo menciones contrastado|fundado.
 * Checklist del caso = OR de ítems de menciones fundado con cita+URL.
 */
export function consolidarCasoFromMenciones(
  caso: CasoLike,
  menciones: MencionLike[],
): ConsolidarCasoResult {
  const credibles = menciones.filter((m) =>
    isCreditableEstado(m.evidencia_estado as EvidenciaEstado),
  );
  const candidatos = menciones.filter(
    (m) => (m.evidencia_estado || "candidato") === "candidato",
  );

  const nCredibles = credibles.length;
  const nCandidatos = candidatos.length;
  const nTotal = menciones.length;

  const fechas = menciones
    .map((m) => m.fecha)
    .filter((f): f is string => typeof f === "string" && f.length > 0 && f !== "N/D")
    .sort();

  const fromFundado = mergeChecklistFromFundado(menciones);
  const hasAnyFundado = Object.values(fromFundado).some(Boolean);
  const checklist: EspecificidadChecklist = hasAnyFundado
    ? fromFundado
    : {
        plan_mecanismo: false,
        responsables_equipo: false,
        plazos: false,
        recursos: false,
        metricas: false,
        contraste_status_quo: false,
      };

  const especificidad = scoreEspecificidad(checklist);

  const repeticion_norm = scoreRepeticion(nCredibles);
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

  const evidencia_nivel = computeEvidenciaNivelCaso(menciones);
  const lineas_fuente = lineasFromMenciones(menciones);
  const evidencia_resumen = `${nCredibles} credibles / ${nCandidatos} candidatos / ${nTotal} total; nivel=${evidencia_nivel}`;

  const pendientes = (caso.campos_pendientes ?? []).filter(
    (x) => x !== "recalcular_n_menciones",
  );
  if (evidencia_nivel === "insuficiente" && !pendientes.includes("evidencia_contraste")) {
    pendientes.push("evidencia_contraste");
  }

  return {
    n_menciones: nCredibles,
    n_menciones_candidato: nCandidatos,
    n_menciones_credibles: nCredibles,
    lineas_fuente,
    evidencia_nivel,
    evidencia_resumen,
    primera_mencion_at: fechas[0] ?? null,
    ultima_mencion_at: fechas[fechas.length - 1] ?? null,
    especificidad,
    especificidad_checklist: checklist,
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

/**
 * Re-evalúa evidencia_estado de todas las menciones del mismo caso
 * (promoción por contraste multi-línea).
 */
export function promoteMencionesContraste(
  menciones: MencionEvidencia[],
  nowMs = Date.now(),
): MencionEvidencia[] {
  return menciones.map((m, i) => {
    const siblings = menciones.filter((_, j) => j !== i);
    const next = computeEvidenciaEstadoForMencion(m, siblings, nowMs);
    return { ...m, evidencia_estado: next };
  });
}
