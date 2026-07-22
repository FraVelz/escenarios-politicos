import { describe, expect, it } from "vitest";
import {
  calcularCredibilidad,
  scoreCentralidad,
  scoreEspecificidad,
  scoreRepeticion,
} from "./credibilidad";

describe("scoreEspecificidad", () => {
  it("suma puntos del checklist hasta 100", () => {
    expect(
      scoreEspecificidad({
        plan_mecanismo: true,
        responsables_equipo: true,
        plazos: true,
        recursos: true,
        metricas: true,
        contraste_status_quo: true,
      }),
    ).toBe(100);
  });

  it("devuelve 0 si nada está marcado", () => {
    expect(
      scoreEspecificidad({
        plan_mecanismo: false,
        responsables_equipo: false,
        plazos: false,
        recursos: false,
        metricas: false,
        contraste_status_quo: false,
      }),
    ).toBe(0);
  });
});

describe("scoreRepeticion", () => {
  it("mapea 0, 1 y >=30 según playbook", () => {
    expect(scoreRepeticion(0)).toBe(0);
    expect(scoreRepeticion(1)).toBe(20);
    expect(scoreRepeticion(30)).toBe(100);
    expect(scoreRepeticion(100)).toBe(100);
  });
});

describe("scoreCentralidad", () => {
  it("prioriza discurso identidad", () => {
    expect(scoreCentralidad(true, "lateral")).toBe(100);
    expect(scoreCentralidad(false, "identidad")).toBe(100);
    expect(scoreCentralidad(false, "cierre")).toBe(70);
    expect(scoreCentralidad(false, "lateral")).toBe(20);
    expect(scoreCentralidad(false, "periferica")).toBe(10);
  });
});

describe("calcularCredibilidad", () => {
  it("aplica 0.45×esp + 0.25×rep + 0.30×cen", () => {
    const { credibilidad, desglose } = calcularCredibilidad({
      checklist: {
        plan_mecanismo: true,
        responsables_equipo: true,
        plazos: true,
        recursos: true,
        metricas: true,
        contraste_status_quo: true,
      },
      nMenciones: 30,
      discursoIdentidad: true,
    });
    expect(desglose).toEqual({
      especificidad: 100,
      repeticion_norm: 100,
      centralidad: 100,
    });
    expect(credibilidad).toBe(100);
  });
});
