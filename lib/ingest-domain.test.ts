import { describe, expect, it } from "vitest";
import { validateDomainPayload } from "./ingest-domain";

describe("validateDomainPayload", () => {
  it("acepta caso completo", () => {
    const result = validateDomainPayload("casos", {
      id: "empleo-eslogan",
      country_id: "co",
      titulo: "Empleo eslogan",
      area: "empleo",
      actor_id: "co-abelardo-espriella",
      fase: "campana",
      n_menciones: 1,
      especificidad: 0,
      credibilidad: 11,
      credibilidad_desglose: {
        especificidad: 0,
        repeticion_norm: 20,
        centralidad: 20,
      },
      discurso_identidad: false,
      importancia: "alta",
      factibilidad: "N/D",
      revision: "pendiente",
      campos_pendientes: ["factibilidad"],
      updated_at: "2026-07-22T00:00:00Z",
      workflow_id: "wf-d-clasificar",
    });
    expect(result.ok).toBe(true);
  });

  it("rechaza caso sin desglose", () => {
    const result = validateDomainPayload("casos", {
      id: "x",
      country_id: "co",
      titulo: "X",
      area: "empleo",
      actor_id: "a",
      fase: "campana",
      n_menciones: 0,
      especificidad: 0,
      credibilidad: 0,
      discurso_identidad: false,
      importancia: "N/D",
      factibilidad: "N/D",
      revision: "pendiente",
      campos_pendientes: [],
      updated_at: "2026-07-22T00:00:00Z",
    });
    expect(result.ok).toBe(false);
  });

  it("rechaza mencion con url inválida", () => {
    const result = validateDomainPayload("menciones", {
      id: "m1",
      country_id: "co",
      caso_id: "empleo-eslogan",
      actor_id: "co-abelardo-espriella",
      fecha: "2026-07-01",
      url: "not-a-url",
      cita_corta: "hola",
      tipo_pieza: "noticia",
      ingerido_en: "2026-07-22T00:00:00Z",
      workflow_id: "wf-d-clasificar",
    });
    expect(result.ok).toBe(false);
  });

  it("exige country_id en ingest_errors", () => {
    const bad = validateDomainPayload("ingest_errors", {
      id: "e1",
      workflow_id: "wf-d-clasificar",
      reason: "missing url",
      created_at: "2026-07-22T00:00:00Z",
    });
    expect(bad.ok).toBe(false);
    const ok = validateDomainPayload("ingest_errors", {
      id: "e1",
      country_id: "co",
      workflow_id: "wf-d-clasificar",
      reason: "missing url",
      created_at: "2026-07-22T00:00:00Z",
    });
    expect(ok.ok).toBe(true);
  });
});
