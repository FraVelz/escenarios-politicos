import { describe, expect, it } from "vitest";
import { buildPoderGraph } from "./poder-graph";
import type { Institucion } from "./types";

const sample: Institucion[] = [
  {
    id: "co-presidencia",
    country_id: "co",
    nombre: "Presidencia",
    capa: "ejecutivo",
    rol: "Jefe",
    veto_notes: "N/D",
    caso_ids: [],
    fuentes: [],
  },
  {
    id: "co-congreso",
    country_id: "co",
    nombre: "Congreso",
    capa: "legislativo",
    rol: "Legislativo",
    veto_notes: "N/D",
    caso_ids: ["a"],
    fuentes: [],
  },
];

describe("buildPoderGraph", () => {
  it("omite capas sin instituciones", () => {
    const { nodes, edges } = buildPoderGraph(sample);
    const capas = nodes.filter((n) => n.data.kind === "capa");
    expect(capas.map((n) => n.data.capa)).toEqual([
      "ejecutivo",
      "legislativo",
    ]);
    expect(nodes.some((n) => n.data.capa === "elites")).toBe(false);
    expect(edges.length).toBe(4); // root→2 capas + 2 inst
  });

  it("conecta raíz → capa → institución", () => {
    const { edges } = buildPoderGraph(sample);
    expect(edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: "root", target: "capa:ejecutivo" }),
        expect.objectContaining({
          source: "capa:ejecutivo",
          target: "inst:co-presidencia",
        }),
      ]),
    );
  });
});
