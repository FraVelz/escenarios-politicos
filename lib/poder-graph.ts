import type { Edge, Node } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { CAPA_LABELS, CAPA_ORDER } from "./poder";
import type { Institucion, CapaPoder } from "./types";

export type PoderNodeData = {
  kind: "root" | "capa" | "institucion";
  label: string;
  capa?: CapaPoder;
  institucionId?: string;
};

export type PoderSelection =
  | { kind: "root" }
  | { kind: "capa"; capa: CapaPoder }
  | { kind: "institucion"; id: string }
  | null;

const COL_W = 200;
const ROW_H = 110;
const NODE_W = 168;

/** Construye nodos/edges TB: raíz → capas con datos → instituciones. */
export function buildPoderGraph(
  instituciones: Institucion[],
  rootLabel = "Mapa de poder",
): { nodes: Node<PoderNodeData>[]; edges: Edge[] } {
  const capas = CAPA_ORDER.filter((capa) =>
    instituciones.some((i) => i.capa === capa),
  );

  const nodes: Node<PoderNodeData>[] = [];
  const edges: Edge[] = [];

  const span = Math.max(capas.length, 1);
  const totalW = span * COL_W;
  const rootX = totalW / 2 - NODE_W / 2;

  nodes.push({
    id: "root",
    type: "poder",
    position: { x: rootX, y: 0 },
    data: { kind: "root", label: rootLabel },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  });

  capas.forEach((capa, i) => {
    const items = instituciones.filter((inst) => inst.capa === capa);
    const capaId = `capa:${capa}`;
    const capaX = i * COL_W + (COL_W - NODE_W) / 2;

    nodes.push({
      id: capaId,
      type: "poder",
      position: { x: capaX, y: ROW_H },
      data: { kind: "capa", label: CAPA_LABELS[capa], capa },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    });

    edges.push({
      id: `e-root-${capa}`,
      source: "root",
      target: capaId,
      type: "smoothstep",
    });

    const n = items.length;
    items.forEach((inst, j) => {
      const instId = `inst:${inst.id}`;
      const offset =
        n === 1 ? 0 : (j - (n - 1) / 2) * Math.min(COL_W * 0.85, NODE_W + 16);
      nodes.push({
        id: instId,
        type: "poder",
        position: {
          x: capaX + offset,
          y: ROW_H * 2 + j * (n > 3 ? 72 : 0),
        },
        data: {
          kind: "institucion",
          label: inst.nombre,
          capa,
          institucionId: inst.id,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });
      edges.push({
        id: `e-${capa}-${inst.id}`,
        source: capaId,
        target: instId,
        type: "smoothstep",
      });
    });
  });

  return { nodes, edges };
}
