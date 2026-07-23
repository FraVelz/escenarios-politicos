import { describe, expect, it } from "vitest";
import { consolidarCasoFromMenciones } from "./consolidar-caso";

describe("consolidarCasoFromMenciones", () => {
  it("recalcula n y credibilidad conservando centralidad", () => {
    const out = consolidarCasoFromMenciones(
      {
        especificidad_checklist: {
          plan_mecanismo: true,
          responsables_equipo: true,
          plazos: true,
          recursos: true,
          metricas: true,
          contraste_status_quo: true,
        },
        credibilidad_desglose: {
          especificidad: 100,
          repeticion_norm: 20,
          centralidad: 20,
        },
        campos_pendientes: ["recalcular_n_menciones", "factibilidad"],
      },
      [
        { fecha: "2026-01-01" },
        { fecha: "2026-02-01" },
        { fecha: "2026-03-01" },
      ],
    );
    expect(out.n_menciones).toBe(3);
    expect(out.primera_mencion_at).toBe("2026-01-01");
    expect(out.ultima_mencion_at).toBe("2026-03-01");
    expect(out.especificidad).toBe(100);
    expect(out.credibilidad_desglose.centralidad).toBe(20);
    expect(out.credibilidad_desglose.repeticion_norm).toBeGreaterThan(20);
    expect(out.campos_pendientes).toEqual(["factibilidad"]);
  });
});
