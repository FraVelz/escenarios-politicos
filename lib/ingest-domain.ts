import { z } from "zod";
import { AREA_ORDER } from "./areas";

const countryId = z
  .string()
  .min(2)
  .max(8)
  .regex(/^[a-z]{2}(-[a-z0-9]+)?$/);

const checklist = z
  .object({
    plan_mecanismo: z.boolean().optional(),
    responsables_equipo: z.boolean().optional(),
    plazos: z.boolean().optional(),
    recursos: z.boolean().optional(),
    metricas: z.boolean().optional(),
    contraste_status_quo: z.boolean().optional(),
  })
  .optional();

const casoDomainSchema = z
  .object({
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
    credibilidad_desglose: z.object({
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
    workflow_id: z.string().optional(),
    notas: z.string().optional(),
    primera_mencion_at: z.string().nullable().optional(),
    ultima_mencion_at: z.string().nullable().optional(),
    funcion_retorica: z
      .enum(["votos", "agenda", "ambiguedad", "N/D"])
      .optional(),
  })
  .passthrough();

const mencionDomainSchema = z
  .object({
    id: z.string().min(1),
    country_id: countryId,
    caso_id: z.string().min(1),
    actor_id: z.string().min(1),
    fecha: z.string().min(1),
    url: z.string().url(),
    cita_corta: z.string().min(1),
    tipo_pieza: z.enum([
      "discurso",
      "entrevista",
      "comunicado",
      "noticia",
      "debate",
      "programa",
    ]),
    ingerido_en: z.string().min(1),
    workflow_id: z.string().min(1),
    evidencia_checklist: checklist,
  })
  .passthrough();

const indicadorDomainSchema = z
  .object({
    id: z.string().min(1),
    country_id: countryId,
    codigo: z.string().min(1),
    valor: z.union([z.number(), z.string()]),
    fecha: z.string().min(1),
    fuente_url: z.string().min(1),
    pais: z.string().min(1),
    workflow_id: z.string().min(1),
    nombre: z.string().optional(),
    unidad: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .passthrough();

const sanitizedPayloadSchema = z
  .object({
    url: z.string().nullable().optional(),
    titulo: z.string().max(120).nullable().optional(),
    fecha: z.string().nullable().optional(),
  })
  .strict();

const ingestErrorDomainSchema = z
  .object({
    id: z.string().min(1),
    country_id: countryId,
    workflow_id: z.string().min(1),
    reason: z.string().min(1),
    created_at: z.string().min(1),
    payload: sanitizedPayloadSchema.optional(),
  })
  .passthrough();

const rawItemDomainSchema = z
  .object({
    id: z.string().min(1),
    country_id: countryId,
    workflow_id: z.string().min(1),
    url: z.string().min(1),
    titulo: z.string().optional(),
    resumen: z.string().optional(),
    fecha: z.string().optional(),
    fuente: z.string().optional(),
    ingerido_en: z.string().optional(),
    clasificado: z.boolean().optional(),
  })
  .passthrough();

const alertaDomainSchema = z
  .object({
    id: z.string().min(1),
    country_id: countryId,
    workflow_id: z.string().min(1),
    tipo: z.string().min(1),
    caso_id: z.string().min(1),
    mensaje: z.string().min(1),
    created_at: z.string().min(1),
  })
  .passthrough();

const DOMAIN_BY_COLLECTION: Record<
  string,
  z.ZodType<Record<string, unknown>>
> = {
  casos: casoDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
  menciones: mencionDomainSchema as unknown as z.ZodType<
    Record<string, unknown>
  >,
  indicadores: indicadorDomainSchema as unknown as z.ZodType<
    Record<string, unknown>
  >,
  ingest_errors: ingestErrorDomainSchema as unknown as z.ZodType<
    Record<string, unknown>
  >,
  raw_items: rawItemDomainSchema as unknown as z.ZodType<
    Record<string, unknown>
  >,
  alertas: alertaDomainSchema as unknown as z.ZodType<Record<string, unknown>>,
};

/** Reduce payload de error a metadatos no sensibles. */
export function sanitizeIngestErrorPayload(
  raw: unknown,
): { url: string | null; titulo: string | null; fecha: string | null } {
  const obj =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const tituloRaw = obj.titulo ?? obj.title;
  return {
    url: typeof obj.url === "string" ? obj.url.slice(0, 500) : null,
    titulo:
      typeof tituloRaw === "string" ? tituloRaw.slice(0, 120) : null,
    fecha: typeof obj.fecha === "string" ? obj.fecha.slice(0, 40) : null,
  };
}

export function validateDomainPayload(
  collection: string,
  data: Record<string, unknown>,
): { ok: true; data: Record<string, unknown> } | { ok: false; message: string } {
  let prepared = data;
  if (collection === "ingest_errors" && "payload" in data) {
    prepared = {
      ...data,
      payload: sanitizeIngestErrorPayload(data.payload),
    };
  }

  const schema = DOMAIN_BY_COLLECTION[collection];
  if (!schema) return { ok: true, data: prepared };
  const parsed = schema.safeParse(prepared);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = issue?.path?.length ? issue.path.join(".") : "data";
    return {
      ok: false,
      message: `domain: ${path}: ${issue?.message ?? "invalid"}`,
    };
  }
  return { ok: true, data: parsed.data };
}
