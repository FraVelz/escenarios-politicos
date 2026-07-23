import { z } from "zod";
import { AREA_ORDER } from "./areas";
import { scoreEspecificidad, scoreRepeticion, type EspecificidadChecklist } from "./credibilidad";

const countryId = z
  .string()
  .min(2)
  .max(8)
  .regex(/^[a-z]{2}(-[a-z0-9]+)?$/);

const workflowId = z.string().min(1);

const checklist = z
  .strictObject({
    plan_mecanismo: z.boolean(),
    responsables_equipo: z.boolean(),
    plazos: z.boolean(),
    recursos: z.boolean(),
    metricas: z.boolean(),
    contraste_status_quo: z.boolean(),
  })
  .optional();

const fuenteRef = z.strictObject({
  medio: z.string().min(1),
  url: z.string().min(1),
  fecha: z.string().min(1),
  nota: z.string().optional(),
});

const EMPTY_CHECKLIST: EspecificidadChecklist = {
  plan_mecanismo: false,
  responsables_equipo: false,
  plazos: false,
  recursos: false,
  metricas: false,
  contraste_status_quo: false,
};

/** Niveles de centralidad del playbook (no valores arbitrarios). */
const ALLOWED_CENTRALIDAD = new Set([10, 20, 70, 100]);

const casoDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  titulo: z.string().min(1),
  area: z.enum(AREA_ORDER),
  actor_id: z.string().min(1),
  fase: z.enum(["campana", "transicion", "gobierno"]),
  n_menciones: z.number().int().min(0),
  especificidad: z.number().min(0).max(100),
  especificidad_checklist: checklist,
  credibilidad: z.number().min(0).max(100),
  credibilidad_desglose: z.strictObject({
    especificidad: z.number(),
    repeticion_norm: z.number(),
    centralidad: z.number(),
  }),
  discurso_identidad: z.boolean(),
  importancia: z.enum(["alta", "media", "baja", "N/D"]),
  factibilidad: z.enum(["alta", "media", "baja", "N/D"]),
  revision: z.enum(["pendiente", "en_seguimiento", "archivado"]),
  campos_pendientes: z.array(z.string()),
  updated_at: z.string().min(1),
  workflow_id: workflowId.optional(),
  notas: z.string().optional(),
  primera_mencion_at: z.string().nullable().optional(),
  ultima_mencion_at: z.string().nullable().optional(),
  funcion_retorica: z.enum(["votos", "agenda", "ambiguedad", "N/D"]).optional(),
});

const mencionDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  caso_id: z.string().min(1),
  actor_id: z.string().min(1),
  fecha: z.string().min(1),
  url: z.url(),
  cita_corta: z.string().min(1),
  tipo_pieza: z.enum(["discurso", "entrevista", "comunicado", "noticia", "debate", "programa"]),
  ingerido_en: z.string().min(1),
  workflow_id: workflowId,
  evidencia_checklist: checklist,
});

const indicadorDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  codigo: z.string().min(1),
  valor: z.union([z.number(), z.string()]),
  fecha: z.string().min(1),
  fuente_url: z.string().min(1),
  pais: z.string().min(1),
  workflow_id: workflowId,
  nombre: z.string().optional(),
  unidad: z.string().optional(),
  updated_at: z.string().optional(),
});

const sanitizedPayloadSchema = z.strictObject({
  url: z.string().nullable().optional(),
  titulo: z.string().max(120).nullable().optional(),
  fecha: z.string().nullable().optional(),
});

const ingestErrorDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  workflow_id: workflowId,
  reason: z.string().min(1).max(2000),
  created_at: z.string().min(1),
  payload: sanitizedPayloadSchema.optional(),
});

const INGEST_ERROR_KEYS = new Set([
  "id",
  "country_id",
  "workflow_id",
  "reason",
  "created_at",
  "payload",
]);

const rawItemDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  workflow_id: workflowId,
  url: z.string().min(1),
  titulo: z.string().optional(),
  resumen: z.string().optional(),
  fecha: z.string().optional(),
  fuente: z.string().optional(),
  ingerido_en: z.string().optional(),
  clasificado: z.boolean().optional(),
});

const alertaDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  workflow_id: workflowId,
  tipo: z.string().min(1),
  caso_id: z.string().min(1),
  mensaje: z.string().min(1),
  created_at: z.string().min(1),
});

const eventoDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  workflow_id: workflowId,
  titulo: z.string().min(1),
  fecha: z.string().min(1),
  url: z.string().min(1),
  fuente: z.enum(["oficial", "medio", "datos", "otro"]),
  ingerido_en: z.string().min(1),
  resumen: z.string().optional(),
  caso_ids: z.array(z.string()).optional(),
});

const institucionDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  workflow_id: workflowId,
  nombre: z.string().min(1),
  capa: z.enum([
    "ejecutivo",
    "legislativo",
    "judicial",
    "macro",
    "seguridad",
    "regional",
    "elites",
  ]),
  rol: z.string().min(1),
  veto_notes: z.string(),
  caso_ids: z.array(z.string()),
  fuentes: z.array(fuenteRef),
});

const partidoDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  workflow_id: workflowId,
  nombre: z.string().min(1),
  coalicion: z.string().min(1),
  espectro: z.string().min(1),
  fuentes: z.array(fuenteRef),
});

const actorDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  workflow_id: workflowId,
  nombre: z.string().min(1),
  partido_id: z.string().nullable(),
  roles: z.array(z.string()),
  caso_ids: z.array(z.string()),
  fuentes: z.array(fuenteRef),
});

const escenarioDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  workflow_id: workflowId,
  tipo: z.enum(["base", "optimista", "pesimista"]),
  titulo: z.string().min(1),
  resumen: z.string().min(1),
  horizonte_dias: z.number().int().positive(),
  fuente_url: z.url().nullable().optional(),
});

const senalDomainSchema = z.strictObject({
  id: z.string().min(1),
  country_id: countryId,
  workflow_id: workflowId,
  titulo: z.string().min(1),
  detalle: z.string().min(1),
  created_at: z.string().min(1),
  escenario_id: z.string().nullable().optional(),
  caso_id: z.string().nullable().optional(),
  fuente_url: z.url().nullable().optional(),
});

const marcoFuente = z.strictObject({
  medio: z.string().min(1),
  url: z.string().min(1),
  fecha: z.string().min(1),
  nota: z.string().optional(),
});

const marcoActor = z.strictObject({
  nombre: z.string().min(1),
  rol_label: z.string().min(1),
  periodo_inicio: z.string().optional(),
  periodo_fin: z.string().optional(),
  posesion_at: z.string().optional(),
  vice_nombre: z.string().optional(),
  imagen_url: z.string().nullable().optional(),
  imagen_credito: z.string().nullable().optional(),
  imagen_fuente_url: z.string().nullable().optional(),
  fuentes: z.array(marcoFuente),
});

const marcoDomainSchema = z.strictObject({
  id: z.string().min(1).optional(),
  country_id: countryId,
  workflow_id: workflowId,
  tipo_analisis: z.string().min(1),
  estado_acto: z.enum([
    "gobierno_estable",
    "transicion_pre_posesion",
    "post_transicion_reciente",
    "sin_sucesor_conocido",
  ]),
  actualizado_at: z.string().min(1),
  pregunta_central: z.string().min(1),
  horizontes_dias: z.array(z.number().int().positive()),
  presidente_ejercicio: marcoActor,
  presidente_electo_o_sucesor: marcoActor,
  timeline: z.array(
    z.strictObject({
      fecha: z.string().min(1),
      titulo: z.string().min(1),
      detalle: z.string().min(1),
      fuente_url: z.string().nullable().optional(),
    }),
  ),
  contraste_ejes: z.array(
    z.strictObject({
      id: z.string().min(1),
      titulo: z.string().min(1),
      lado_a: z.string().min(1),
      lado_b: z.string().min(1),
      fuente_url: z.string().nullable().optional(),
    }),
  ),
});

const ingestRunDomainSchema = z.strictObject({
  id: z.string().min(1),
  workflow_id: workflowId,
  started_at: z.string().min(1),
  finished_at: z.string().optional(),
  status: z.enum(["ok", "error", "partial"]),
  country_id: countryId.optional(),
  stats: z.record(z.string(), z.unknown()).optional(),
  error: z.string().max(2000).optional(),
});

const DOMAIN_BY_COLLECTION: Record<string, z.ZodType<Record<string, unknown>>> = {
  casos: casoDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  menciones: mencionDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  indicadores: indicadorDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  ingest_errors: ingestErrorDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  raw_items: rawItemDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  alertas: alertaDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  eventos: eventoDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  instituciones: institucionDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  partidos: partidoDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  actores: actorDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  escenarios: escenarioDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  senales: senalDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  marco: marcoDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  ingest_runs: ingestRunDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
};

function resolveCentralidad(discursoIdentidad: boolean, incoming: unknown): number {
  if (discursoIdentidad) return 100;
  if (typeof incoming === "number" && ALLOWED_CENTRALIDAD.has(incoming)) {
    return incoming;
  }
  return 20;
}

/** Fuerza desglose + % según fórmula del playbook. */
export function enforceCasoCredibilidad(data: Record<string, unknown>): Record<string, unknown> {
  const checklistRaw = data.especificidad_checklist;
  const hasChecklist =
    checklistRaw && typeof checklistRaw === "object" && !Array.isArray(checklistRaw);
  const cl = hasChecklist
    ? ({ ...EMPTY_CHECKLIST, ...(checklistRaw as object) } as EspecificidadChecklist)
    : EMPTY_CHECKLIST;

  const nMenciones = Number(data.n_menciones ?? 0);
  const discursoIdentidad = Boolean(data.discurso_identidad);
  const incomingCen =
    data.credibilidad_desglose &&
    typeof data.credibilidad_desglose === "object" &&
    !Array.isArray(data.credibilidad_desglose)
      ? (data.credibilidad_desglose as { centralidad?: unknown }).centralidad
      : undefined;

  const especificidad = hasChecklist
    ? scoreEspecificidad(cl)
    : Math.min(100, Math.max(0, Number(data.especificidad ?? 0)));
  const repeticion_norm = scoreRepeticion(nMenciones);
  const centralidad = resolveCentralidad(discursoIdentidad, incomingCen);
  const credibilidad = Math.round(
    Math.min(100, Math.max(0, 0.45 * especificidad + 0.25 * repeticion_norm + 0.3 * centralidad)),
  );

  return {
    ...data,
    especificidad,
    credibilidad,
    credibilidad_desglose: {
      especificidad,
      repeticion_norm,
      centralidad,
    },
  };
}

/** Reduce payload de error a metadatos no sensibles. */
export function sanitizeIngestErrorPayload(raw: unknown): {
  url: string | null;
  titulo: string | null;
  fecha: string | null;
} {
  const obj =
    raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const tituloRaw = obj.titulo ?? obj.title;
  return {
    url: typeof obj.url === "string" ? obj.url.slice(0, 500) : null,
    titulo: typeof tituloRaw === "string" ? tituloRaw.slice(0, 120) : null,
    fecha: typeof obj.fecha === "string" ? obj.fecha.slice(0, 40) : null,
  };
}

function whitelistIngestError(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of INGEST_ERROR_KEYS) {
    if (key in data) out[key] = data[key];
  }
  if ("payload" in out) {
    out.payload = sanitizeIngestErrorPayload(out.payload);
  }
  return out;
}

export function validateDomainPayload(
  collection: string,
  data: Record<string, unknown>,
): { ok: true; data: Record<string, unknown> } | { ok: false; message: string } {
  const schema = DOMAIN_BY_COLLECTION[collection];
  if (!schema) {
    return {
      ok: false,
      message: `domain: unsupported collection '${collection}'`,
    };
  }

  let prepared = data;
  if (collection === "ingest_errors") {
    prepared = whitelistIngestError(data);
  }

  const parsed = schema.safeParse(prepared);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = issue?.path?.length ? issue.path.join(".") : "data";
    return {
      ok: false,
      message: `domain: ${path}: ${issue?.message ?? "invalid"}`,
    };
  }

  let out = parsed.data;
  if (collection === "casos") {
    out = enforceCasoCredibilidad(out);
  }
  return { ok: true, data: out };
}
