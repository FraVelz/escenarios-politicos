import { describe, expect, it } from "vitest";
import { ingestBodySchema } from "./ingest-schema";

describe("ingestBodySchema", () => {
  it("acepta payload válido", () => {
    const result = ingestBodySchema.safeParse({
      collection: "casos",
      id: "caso-1",
      data: { workflow_id: "wf-test", titulo: "Demo" },
    });
    expect(result.success).toBe(true);
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
      data: { workflow_id: "manual-1" },
    });
    expect(result.success).toBe(false);
  });

  it("acepta seed- como prefijo", () => {
    const result = ingestBodySchema.safeParse({
      collection: "menciones",
      id: "m-1",
      data: { workflow_id: "seed-local" },
    });
    expect(result.success).toBe(true);
  });
});
