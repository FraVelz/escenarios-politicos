import { describe, expect, it } from "vitest";
import { ingestBodySchema } from "./ingest-schema";

describe("ingestBodySchema", () => {
  it("acepta payload válido con country_id", () => {
    const result = ingestBodySchema.safeParse({
      collection: "casos",
      id: "caso-1",
      data: { workflow_id: "wf-test", titulo: "Demo", country_id: "co" },
    });
    expect(result.success).toBe(true);
  });

  it("rechaza casos sin country_id", () => {
    const result = ingestBodySchema.safeParse({
      collection: "casos",
      id: "caso-1",
      data: { workflow_id: "wf-test", titulo: "Demo" },
    });
    expect(result.success).toBe(false);
  });

  it("rechaza country_id con formato inválido", () => {
    const result = ingestBodySchema.safeParse({
      collection: "casos",
      id: "caso-1",
      data: { workflow_id: "wf-test", country_id: "COL" },
    });
    expect(result.success).toBe(false);
  });

  it("exige country_id en ingest_errors e indicadores", () => {
    for (const collection of ["ingest_errors", "indicadores"] as const) {
      const bad = ingestBodySchema.safeParse({
        collection,
        id: "x-1",
        data: { workflow_id: "wf-a" },
      });
      expect(bad.success).toBe(false);
      const ok = ingestBodySchema.safeParse({
        collection,
        id: "x-1",
        data: { workflow_id: "wf-a", country_id: "co" },
      });
      expect(ok.success).toBe(true);
    }
  });

  it("rechaza colección desconocida", () => {
    const result = ingestBodySchema.safeParse({
      collection: "usuarios",
      id: "x",
      data: { workflow_id: "wf-1" },
    });
    expect(result.success).toBe(false);
  });

  it("rechaza workflow_id inválido", () => {
    const result = ingestBodySchema.safeParse({
      collection: "casos",
      id: "caso-1",
      data: { workflow_id: "manual-1", country_id: "co" },
    });
    expect(result.success).toBe(false);
  });

  it("acepta seed- como prefijo", () => {
    const result = ingestBodySchema.safeParse({
      collection: "menciones",
      id: "m-1",
      data: { workflow_id: "seed-local", country_id: "co" },
    });
    expect(result.success).toBe(true);
  });

  it("raw_items exige country_id", () => {
    const bad = ingestBodySchema.safeParse({
      collection: "raw_items",
      id: "r-1",
      data: { workflow_id: "wf-a" },
    });
    expect(bad.success).toBe(false);
    const ok = ingestBodySchema.safeParse({
      collection: "raw_items",
      id: "r-1",
      data: { workflow_id: "wf-a", country_id: "co" },
    });
    expect(ok.success).toBe(true);
  });
});
