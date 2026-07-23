import { describe, expect, it } from "vitest";
import { consolidarCasoFromMenciones } from "./consolidar-caso";

const fullChecklist = {
  plan_mecanismo: true,
  responsables_equipo: true,
  plazos: true,
  recursos: true,
  metricas: true,
  contraste_status_quo: true,
};

describe("consolidarCasoFromMenciones", () => {
  it("recalcula n y credibilidad; checklist solo desde fundado", () => {
    const out = consolidarCasoFromMenciones(
      {
        especificidad_checklist: fullChecklist,
        credibilidad_desglose: {
          especificidad: 100,
          repeticion_norm: 20,
          centralidad: 20,
        },
        campos_pendientes: ["recalcular_n_menciones", "factibilidad"],
      },
      [
        {
          fecha: "2026-01-01",
          evidencia_estado: "contrastado",
          fuente_linea: "centro",
          fuente_clase: "medio",
          cita_corta: "cobertura",
          url: "https://www.elespectador.com/a",
        },
        {
          fecha: "2026-02-01",
          evidencia_estado: "contrastado",
          fuente_linea: "critica",
          fuente_clase: "medio",
          cita_corta: "otra",
          url: "https://www.lasillavacia.com/b",
        },
        {
          fecha: "2026-03-01",
          evidencia_estado: "fundado",
          fuente_linea: "institucional",
          fuente_clase: "oficial",
          cita_corta: "Plan completo",
          url: "https://www.presidencia.gov.co/prensa/x",
          evidencia_checklist: fullChecklist,
        },
      ],
    );
    expect(out.n_menciones).toBe(3);
    expect(out.n_menciones_credibles).toBe(3);
    expect(out.primera_mencion_at).toBe("2026-01-01");
    expect(out.ultima_mencion_at).toBe("2026-03-01");
    expect(out.especificidad).toBe(100);
    expect(out.credibilidad_desglose.centralidad).toBe(20);
    expect(out.credibilidad_desglose.repeticion_norm).toBeGreaterThan(20);
    expect(out.evidencia_nivel).toBe("fundado");
    expect(out.campos_pendientes).toEqual(["factibilidad"]);
  });

  it("sin fundado, especificidad cae a 0 aunque el caso tuviera checklist", () => {
    const out = consolidarCasoFromMenciones(
      {
        especificidad_checklist: fullChecklist,
        credibilidad_desglose: {
          especificidad: 100,
          repeticion_norm: 20,
          centralidad: 20,
        },
      },
      [
        {
          fecha: "2026-01-01",
          evidencia_estado: "contrastado",
          fuente_linea: "centro",
          fuente_clase: "medio",
        },
      ],
    );
    expect(out.especificidad).toBe(0);
    expect(out.n_menciones).toBe(1);
  });
});
