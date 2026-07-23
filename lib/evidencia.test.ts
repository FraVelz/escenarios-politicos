import { describe, expect, it } from "vitest";
import {
  computeEvidenciaEstadoForMencion,
  computeEvidenciaNivelCaso,
  heuristicChecklistFromText,
  isCreditableEstado,
} from "./evidencia";
import { consolidarCasoFromMenciones, promoteMencionesContraste } from "./consolidar-caso";

describe("evidencia", () => {
  it("una sola línea permanece candidato", () => {
    const m = {
      fuente_linea: "centro",
      fuente_clase: "medio",
      cita_corta: "hola",
      url: "https://www.elespectador.com/politica/x",
      evidencia_estado: "candidato" as const,
    };
    expect(computeEvidenciaEstadoForMencion(m, [])).toBe("candidato");
  });

  it("dos líneas distintas → contrastado", () => {
    const a = {
      fuente_linea: "centro",
      fuente_clase: "medio",
      cita_corta: "a",
      url: "https://www.elespectador.com/a",
      fecha: "2026-07-01",
    };
    const b = {
      fuente_linea: "critica",
      fuente_clase: "medio",
      cita_corta: "b",
      url: "https://www.lasillavacia.com/b",
      fecha: "2026-07-02",
    };
    expect(computeEvidenciaEstadoForMencion(a, [b])).toBe("contrastado");
    expect(computeEvidenciaEstadoForMencion(b, [a])).toBe("contrastado");
  });

  it("oficial + medio → contrastado; con checklist → fundado", () => {
    const oficial = {
      fuente_linea: "institucional",
      fuente_clase: "oficial",
      cita_corta: "Plan con plazos a 18 meses",
      url: "https://www.presidencia.gov.co/prensa/x",
      evidencia_checklist: heuristicChecklistFromText(
        "Plan con plazos a 18 meses y presupuesto",
      ),
      fecha: "2026-07-01",
    };
    const medio = {
      fuente_linea: "centro",
      fuente_clase: "medio",
      cita_corta: "cobertura",
      url: "https://www.elespectador.com/x",
      fecha: "2026-07-02",
    };
    expect(computeEvidenciaEstadoForMencion(oficial, [medio])).toBe("fundado");
    expect(computeEvidenciaEstadoForMencion(medio, [oficial])).toBe("contrastado");
  });

  it("nivel de caso insuficiente sin credibles", () => {
    expect(
      computeEvidenciaNivelCaso([
        { evidencia_estado: "candidato", fuente_linea: "centro" },
      ]),
    ).toBe("insuficiente");
  });

  it("isCreditableEstado", () => {
    expect(isCreditableEstado("candidato")).toBe(false);
    expect(isCreditableEstado("contrastado")).toBe(true);
    expect(isCreditableEstado("fundado")).toBe(true);
  });
});

describe("consolidar con cuarentena", () => {
  it("candidatos no entran a repetición ni n_menciones", () => {
    const patch = consolidarCasoFromMenciones(
      {
        discurso_identidad: false,
        especificidad_checklist: {
          plan_mecanismo: false,
          responsables_equipo: false,
          plazos: false,
          recursos: false,
          metricas: false,
          contraste_status_quo: false,
        },
        credibilidad_desglose: {
          especificidad: 0,
          repeticion_norm: 20,
          centralidad: 20,
        },
      },
      [
        {
          fecha: "2026-07-01",
          evidencia_estado: "candidato",
          fuente_linea: "centro",
          fuente_clase: "medio",
        },
        {
          fecha: "2026-07-02",
          evidencia_estado: "candidato",
          fuente_linea: "centro",
          fuente_clase: "medio",
        },
      ],
    );
    expect(patch.n_menciones).toBe(0);
    expect(patch.n_menciones_candidato).toBe(2);
    expect(patch.n_menciones_credibles).toBe(0);
    expect(patch.credibilidad_desglose.repeticion_norm).toBe(0);
    expect(patch.evidencia_nivel).toBe("insuficiente");
  });

  it("promoteMencionesContraste eleva a contrastado", () => {
    const promoted = promoteMencionesContraste([
      {
        fuente_linea: "centro",
        fuente_clase: "medio",
        cita_corta: "a",
        url: "https://a.example/x",
        fecha: "2026-07-01",
        evidencia_estado: "candidato",
      },
      {
        fuente_linea: "critica",
        fuente_clase: "medio",
        cita_corta: "b",
        url: "https://b.example/y",
        fecha: "2026-07-02",
        evidencia_estado: "candidato",
      },
    ]);
    expect(promoted.every((m) => m.evidencia_estado === "contrastado")).toBe(
      true,
    );
  });
});
