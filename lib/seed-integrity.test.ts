import { describe, expect, it } from "vitest";
import { scoreEspecificidad, scoreRepeticion } from "./credibilidad";
import casos from "../content/seed/casos.json";
import menciones from "../content/seed/menciones.json";
import actores from "../content/seed/actores.json";
import partidos from "../content/seed/partidos.json";
import type { Caso } from "./types";

describe("integridad seed", () => {
  const casosList = casos as Caso[];
  const actorIds = new Set(actores.map((a) => a.id));
  const partidoIds = new Set(partidos.map((p) => p.id));
  const casoIds = new Set(casosList.map((c) => c.id));

  it("cada caso tiene country_id y actor_id válido", () => {
    for (const c of casosList) {
      expect(c.country_id).toMatch(/^[a-z]{2}/);
      expect(actorIds.has(c.actor_id)).toBe(true);
    }
  });

  it("n_menciones (credibles) cuadra; candidatos aparte", () => {
    const credCounts = new Map<string, number>();
    const candCounts = new Map<string, number>();
    for (const m of menciones) {
      expect(casoIds.has(m.caso_id)).toBe(true);
      expect(m.country_id).toBeTruthy();
      expect(actorIds.has(m.actor_id)).toBe(true);
      expect(m.evidencia_estado).toBeTruthy();
      if (m.evidencia_estado === "contrastado" || m.evidencia_estado === "fundado") {
        credCounts.set(m.caso_id, (credCounts.get(m.caso_id) || 0) + 1);
      }
      if (m.evidencia_estado === "candidato") {
        candCounts.set(m.caso_id, (candCounts.get(m.caso_id) || 0) + 1);
      }
    }
    for (const c of casosList) {
      expect(c.n_menciones).toBe(credCounts.get(c.id) || 0);
      expect(c.n_menciones_credibles ?? c.n_menciones).toBe(
        credCounts.get(c.id) || 0,
      );
      expect(c.n_menciones_candidato ?? 0).toBe(candCounts.get(c.id) || 0);
      expect(c.evidencia_nivel).toBeTruthy();
    }
  });

  it("credibilidad audita con repetición solo de credibles", () => {
    for (const c of casosList) {
      expect(c.especificidad_checklist).toBeTruthy();
      expect(scoreEspecificidad(c.especificidad_checklist!)).toBe(
        c.especificidad,
      );
      const nCred = c.n_menciones_credibles ?? c.n_menciones;
      expect(scoreRepeticion(nCred)).toBe(c.credibilidad_desglose.repeticion_norm);
      const { especificidad, repeticion_norm, centralidad } =
        c.credibilidad_desglose;
      const expected = Math.round(
        0.45 * especificidad + 0.25 * repeticion_norm + 0.3 * centralidad,
      );
      expect(c.credibilidad).toBe(expected);
    }
  });

  it("partidos referenciados existen", () => {
    for (const a of actores) {
      if (a.partido_id) expect(partidoIds.has(a.partido_id)).toBe(true);
      expect(a.country_id).toBeTruthy();
    }
  });
});
