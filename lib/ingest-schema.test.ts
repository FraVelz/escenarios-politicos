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

  it("raw_items no exige country_id", () => {
    const result = ingestBodySchema.safeParse({
      collection: "raw_items",
      id: "r-1",
      data: { workflow_id: "wf-a" },
    });
    expect(result.success).toBe(true);
  });
});
