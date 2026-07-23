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

  it("sanitiza payload grueso de ingest_errors", () => {
    const result = validateDomainPayload("ingest_errors", {
      id: "e2",
      country_id: "co",
      workflow_id: "wf-d-clasificar",
      reason: "x",
      created_at: "2026-07-22T00:00:00Z",
      payload: {
        url: "https://example.com/a",
        titulo: "Hola",
        secret: "should-drop",
        body: "full article text",
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.payload).toEqual({
        url: "https://example.com/a",
        titulo: "Hola",
        fecha: null,
      });
    }
  });

  it("stripea campos extra de ingest_errors (whitelist)", () => {
    const result = validateDomainPayload("ingest_errors", {
      id: "e3",
      country_id: "co",
      workflow_id: "wf-d-clasificar",
      reason: "fail",
      created_at: "2026-07-22T00:00:00Z",
      stack: "Error: boom\n    at foo",
      headers: { authorization: "Bearer secret" },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).not.toHaveProperty("stack");
      expect(result.data).not.toHaveProperty("headers");
      expect(result.data.reason).toBe("fail");
    }
  });

  it("rechaza reason demasiado largo en ingest_errors", () => {
    const result = validateDomainPayload("ingest_errors", {
      id: "e4",
      country_id: "co",
      workflow_id: "wf-d-clasificar",
      reason: "x".repeat(2001),
      created_at: "2026-07-22T00:00:00Z",
    });
    expect(result.ok).toBe(false);
  });

  it("exige schema de dominio para todas las colecciones allowlist", () => {
    const result = validateDomainPayload("eventos", {
      id: "ev1",
      country_id: "co",
      workflow_id: "wf-c-rss",
      titulo: "Evento",
      fecha: "2026-07-01",
      url: "https://example.com/e",
      fuente: "medio",
      ingerido_en: "2026-07-22T00:00:00Z",
    });
    expect(result.ok).toBe(true);

    const noSchemaFallback = validateDomainPayload("tensiones" as string, {
      id: "t1",
      workflow_id: "wf-test",
    });
    expect(noSchemaFallback.ok).toBe(false);
  });

  it("recalcula credibilidad del caso según fórmula", () => {
    const result = validateDomainPayload("casos", {
      id: "empleo-eslogan",
      country_id: "co",
      titulo: "Empleo eslogan",
      area: "empleo",
      actor_id: "co-abelardo-espriella",
      fase: "campana",
      n_menciones: 1,
      especificidad: 0,
      especificidad_checklist: {
        plan_mecanismo: false,
        responsables_equipo: false,
        plazos: false,
        recursos: false,
        metricas: false,
        contraste_status_quo: false,
      },
      credibilidad: 99,
      credibilidad_desglose: {
        especificidad: 99,
        repeticion_norm: 99,
        centralidad: 99,
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
    if (result.ok) {
      expect(result.data.credibilidad).toBe(11);
      expect(result.data.credibilidad_desglose).toEqual({
        especificidad: 0,
        repeticion_norm: 20,
        centralidad: 20,
      });
      expect(result.data.especificidad).toBe(0);
    }
  });

  it("acepta escenario con campos de catálogo", () => {
    const result = validateDomainPayload("escenarios", {
      id: "co-esc-base",
      country_id: "co",
      workflow_id: "seed-local",
      tipo: "base",
      titulo: "Base",
      resumen: "Resumen",
      horizonte_dias: 90,
      fuente_url: "https://example.com/x",
    });
    expect(result.ok).toBe(true);
  });

  it("rechaza campos desconocidos en menciones (strict)", () => {
    const result = validateDomainPayload("menciones", {
      id: "m1",
      country_id: "co",
      caso_id: "empleo-eslogan",
      actor_id: "co-abelardo-espriella",
      fecha: "2026-07-01",
      url: "https://example.com/m",
      cita_corta: "hola",
      tipo_pieza: "noticia",
      ingerido_en: "2026-07-22T00:00:00Z",
      workflow_id: "wf-d-clasificar",
      leaked_secret: "nope",
    });
    expect(result.ok).toBe(false);
  });
});
