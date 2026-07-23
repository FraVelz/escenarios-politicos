import type { EspecificidadChecklist } from "./credibilidad";
import type { FuenteClase, FuenteLinea } from "./fuentes-registro";

export const EVIDENCIA_ESTADOS = [
  "candidato",
  "contrastado",
  "fundado",
  "en_conflicto",
  "rechazado",
] as const;

export type EvidenciaEstado = (typeof EVIDENCIA_ESTADOS)[number];

export const EVIDENCIA_NIVELES = [
  "insuficiente",
  "contraste_parcial",
  "fundado",
] as const;

export type EvidenciaNivel = (typeof EVIDENCIA_NIVELES)[number];

export const CREDITABLE_ESTADOS: ReadonlySet<EvidenciaEstado> = new Set([
  "contrastado",
  "fundado",
]);

export function isCreditableEstado(
  estado: EvidenciaEstado | string | undefined | null,
): boolean {
  return CREDITABLE_ESTADOS.has(estado as EvidenciaEstado);
}

const EMPTY_CHECKLIST: EspecificidadChecklist = {
  plan_mecanismo: false,
  responsables_equipo: false,
  plazos: false,
  recursos: false,
  metricas: false,
  contraste_status_quo: false,
};

export type MencionEvidencia = {
  evidencia_estado?: EvidenciaEstado | string | null;
  fuente_clase?: FuenteClase | string | null;
  fuente_linea?: FuenteLinea | string | null;
  fuente_id?: string | null;
  cita_corta?: string | null;
  url?: string | null;
  evidencia_checklist?: Partial<EspecificidadChecklist> | null;
  fecha?: string | null;
};

/** Ventana default de contraste entre menciones (días). */
export const CONTRASTE_VENTANA_DIAS = 90;

/**
 * Promueve a contrastado si hay ≥2 líneas distintas, o (oficial|datos)+medio.
 * A fundado si además hay checklist parcial con cita+URL.
 */
export function computeEvidenciaEstadoForMencion(
  mencion: MencionEvidencia,
  siblings: MencionEvidencia[],
  nowMs = Date.now(),
): EvidenciaEstado {
  const current = (mencion.evidencia_estado as EvidenciaEstado) || "candidato";
  if (current === "rechazado" || current === "en_conflicto") return current;

  const all = [...siblings, mencion].filter(
    (m) =>
      m.evidencia_estado !== "rechazado" &&
      m.evidencia_estado !== "en_conflicto",
  );

  const withinWindow = all.filter((m) => {
    if (!m.fecha || m.fecha === "N/D") return true;
    const t = Date.parse(m.fecha);
    if (Number.isNaN(t)) return true;
    return nowMs - t <= CONTRASTE_VENTANA_DIAS * 86400000;
  });

  const lineas = new Set(
    withinWindow
      .map((m) => m.fuente_linea)
      .filter((l): l is string => typeof l === "string" && l.length > 0),
  );
  const clases = new Set(
    withinWindow
      .map((m) => m.fuente_clase)
      .filter((c): c is string => typeof c === "string" && c.length > 0),
  );

  const hasOficialODatos = clases.has("oficial") || clases.has("datos");
  const hasMedio = clases.has("medio");
  const multiLinea = lineas.size >= 2;
  const contrasteOk = multiLinea || (hasOficialODatos && hasMedio);

  if (!contrasteOk) return "candidato";

  const hasCita =
    typeof mencion.cita_corta === "string" &&
    mencion.cita_corta.length > 0 &&
    mencion.cita_corta !== "N/D";
  const hasUrl = typeof mencion.url === "string" && mencion.url.startsWith("http");
  const cl = { ...EMPTY_CHECKLIST, ...(mencion.evidencia_checklist || {}) };
  const anyCheck = Object.values(cl).some(Boolean);

  if (hasCita && hasUrl && anyCheck) return "fundado";
  return "contrastado";
}

export function computeEvidenciaNivelCaso(
  menciones: MencionEvidencia[],
): EvidenciaNivel {
  const credibles = menciones.filter((m) =>
    isCreditableEstado(m.evidencia_estado as EvidenciaEstado),
  );
  if (credibles.length === 0) return "insuficiente";

  const lineas = new Set(
    credibles
      .map((m) => m.fuente_linea)
      .filter((l): l is string => typeof l === "string" && l.length > 0),
  );
  const clases = new Set(
    credibles
      .map((m) => m.fuente_clase)
      .filter((c): c is string => typeof c === "string" && c.length > 0),
  );
  const hasOficialODatos = clases.has("oficial") || clases.has("datos");
  const hasMedio = clases.has("medio");

  if (lineas.size >= 2 || (hasOficialODatos && hasMedio)) return "fundado";
  return "contraste_parcial";
}

/** OR de checklists solo desde menciones fundado con cita+URL. */
export function mergeChecklistFromFundado(
  menciones: MencionEvidencia[],
): EspecificidadChecklist {
  const out = { ...EMPTY_CHECKLIST };
  for (const m of menciones) {
    if (m.evidencia_estado !== "fundado") continue;
    const hasCita =
      typeof m.cita_corta === "string" &&
      m.cita_corta.length > 0 &&
      m.cita_corta !== "N/D";
    const hasUrl = typeof m.url === "string" && m.url.startsWith("http");
    if (!hasCita || !hasUrl || !m.evidencia_checklist) continue;
    for (const k of Object.keys(out) as (keyof EspecificidadChecklist)[]) {
      if (m.evidencia_checklist[k]) out[k] = true;
    }
  }
  return out;
}

export function lineasFromMenciones(menciones: MencionEvidencia[]): string[] {
  return [
    ...new Set(
      menciones
        .filter((m) => isCreditableEstado(m.evidencia_estado as EvidenciaEstado))
        .map((m) => m.fuente_linea)
        .filter((l): l is string => typeof l === "string" && l.length > 0),
    ),
  ].sort();
}

/** Heurística conservadora de checklist a partir de texto. */
export function heuristicChecklistFromText(text: string): EspecificidadChecklist {
  const t = String(text || "").toLowerCase();
  return {
    plan_mecanismo:
      /\b(plan|mecanismo|programa|estrategia|hoja de ruta)\b/.test(t),
    responsables_equipo:
      /\b(equipo|ministro|ministerio|responsable|director|agencia)\b/.test(t),
    plazos:
      /\b(plazo|meses|años|cronograma|hito|20\d{2}|en \d+\s*(días|meses|años))\b/.test(
        t,
      ),
    recursos:
      /\b(presupuesto|financi|\$|cop|recursos|reesignaci[oó]n|impuesto)\b/.test(
        t,
      ),
    metricas:
      /\b(indicador|meta|%|porcentaje|kpi|m[eé]trica|cobertura|tasa)\b/.test(t),
    contraste_status_quo:
      /\b(frente a|a diferencia|status quo|modelo anterior|en contraste)\b/.test(
        t,
      ),
  };
}
