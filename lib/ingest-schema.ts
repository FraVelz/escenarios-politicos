import { z } from "zod";

export const ALLOWED_COLLECTIONS = [
  "casos",
  "menciones",
  "indicadores",
  "raw_items",
  "eventos",
  "alertas",
  "ingest_errors",
  "ingest_runs",
] as const;

export const MAX_BODY_BYTES = 256_000;
export const MAX_ID_LEN = 128;

const idSchema = z
  .string()
  .min(1)
  .max(MAX_ID_LEN)
  .regex(/^[a-zA-Z0-9_.:\-]+$/);

export const ingestBodySchema = z.object({
  collection: z.enum(ALLOWED_COLLECTIONS),
  id: idSchema,
  data: z
    .record(z.string(), z.unknown())
    .refine((data) => !Array.isArray(data), {
      message: "data must be an object",
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
});

export type IngestBody = z.infer<typeof ingestBodySchema>;
