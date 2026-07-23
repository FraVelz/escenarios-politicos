import { z } from "zod";

export const ALLOWED_COLLECTIONS = [
  "casos",
  "menciones",
  "indicadores",
  "raw_items",
  "eventos",
  "alertas",
  "instituciones",
  "partidos",
  "actores",
  "escenarios",
  "senales",
  "marco",
  "ingest_errors",
  "ingest_runs",
] as const;

export const MAX_BODY_BYTES = 256_000;
export const MAX_ID_LEN = 128;
export const MAX_DATA_KEYS = 64;

const COLLECTIONS_REQUIRE_COUNTRY = new Set([
  "casos",
  "menciones",
  "instituciones",
  "partidos",
  "actores",
  "escenarios",
  "senales",
  "marco",
  "alertas",
  "ingest_errors",
  "eventos",
  "indicadores",
  "raw_items",
]);

const countryIdSchema = z
  .string()
  .min(2)
  .max(8)
  .regex(/^[a-z]{2}(-[a-z0-9]+)?$/);

const idSchema = z
  .string()
  .min(1)
  .max(MAX_ID_LEN)
  .regex(/^[a-zA-Z0-9_.:\-]+$/);

export const ingestBodySchema = z
  .object({
    collection: z.enum(ALLOWED_COLLECTIONS),
    id: idSchema,
    data: z
      .record(z.string(), z.unknown())
      .refine((data) => !Array.isArray(data), {
        message: "data must be an object",
      })
      .refine((data) => Object.keys(data).length <= MAX_DATA_KEYS, {
        message: `data has too many keys (max ${MAX_DATA_KEYS})`,
      })
      .refine(
        (data) => {
          const workflowId = data.workflow_id;
          return (
            typeof workflowId === "string" && /^(wf-|seed-)/.test(workflowId)
          );
        },
        { message: "data.workflow_id must start with wf- or seed-" },
      ),
  })
  .superRefine((body, ctx) => {
    if (!COLLECTIONS_REQUIRE_COUNTRY.has(body.collection)) return;
    const cid = body.data.country_id;
    const parsed = countryIdSchema.safeParse(cid);
    if (!parsed.success) {
      ctx.addIssue({
        code: "custom",
        message: "data.country_id required (slug ISO-ish, e.g. co)",
        path: ["data", "country_id"],
      });
    }
  });

export type IngestBody = z.infer<typeof ingestBodySchema>;
