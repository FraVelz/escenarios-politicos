"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  buildPoderGraph,
  type PoderNodeData,
  type PoderSelection,
} from "@/lib/poder-graph";
import { CAPA_LABELS } from "@/lib/poder";
import { countryPath } from "@/lib/countries";
import type { Institucion } from "@/lib/types";
import { cn } from "@/lib/utils";

function PoderNode({ data, selected }: NodeProps<Node<PoderNodeData>>) {
  const kind = data.kind;
  return (
    <div
      className={cn(
        "w-[168px] border px-3 py-2 text-left transition-colors",
        kind === "root" && "border-iris bg-muted text-white",
        kind === "capa" && "border-border bg-background text-bone",
        kind === "institucion" && "border-border bg-muted text-white",
        selected && "border-iris ring-1 ring-iris",
      )}
    >
      {kind !== "root" && (
        <Handle
          type="target"
          position={Position.Top}
          className="!h-1.5 !w-1.5 !border-0 !bg-smoke"
        />
      )}
      <p
        className={cn(
          "text-[11px] leading-snug",
          kind === "root" && "text-center text-xs font-medium tracking-tight",
          kind === "capa" && "font-medium text-smoke",
          kind === "institucion" && "font-medium",
        )}
      >
        {data.label}
      </p>
      {kind !== "institucion" && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-1.5 !w-1.5 !border-0 !bg-smoke"
        />
      )}
    </div>
  );
}

const nodeTypes = { poder: PoderNode };

function DetailPanel({
  selection,
  instituciones,
  country,
}: {
  selection: PoderSelection;
  instituciones: Institucion[];
  country: string;
}) {
  if (!selection) {
    return (
      <div className="border border-border bg-muted/40 px-4 py-5">
        <p className="text-sm text-muted-foreground">
          Selecciona una capa o institución en el diagrama para ver rol, veto,
          casos y fuentes.
        </p>
      </div>
    );
  }

  if (selection.kind === "root") {
    return (
      <div className="space-y-2 border border-border px-4 py-5">
        <h2 className="text-lg font-medium text-white">Mapa de poder</h2>
        <p className="text-sm text-muted-foreground">
          Capas institucionales con al menos una entrada. Sin fuente fiable →
          N/D en el detalle. No inventa composición ni cifras.
        </p>
      </div>
    );
  }

  if (selection.kind === "capa") {
    const items = instituciones.filter((i) => i.capa === selection.capa);
    return (
      <div className="space-y-3 border border-border px-4 py-5">
        <h2 className="text-lg font-medium text-white">
          {CAPA_LABELS[selection.capa]}
        </h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {items.map((inst) => (
            <li key={inst.id}>{inst.nombre}</li>
          ))}
        </ul>
        <p className="text-xs text-smoke">
          Haz clic en una institución del diagrama para el detalle completo.
        </p>
      </div>
    );
  }

  const inst = instituciones.find((i) => i.id === selection.id);
  if (!inst) {
    return (
      <div className="border border-border px-4 py-5 text-sm text-muted-foreground">
        N/D — institución no encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-3 border border-border px-4 py-5">
      <div>
        <p className="text-xs uppercase tracking-wide text-smoke">
          {CAPA_LABELS[inst.capa]}
        </p>
        <h2 className="text-lg font-medium text-white">{inst.nombre}</h2>
      </div>
      <p className="text-sm text-muted-foreground">{inst.rol || "N/D"}</p>
      <p className="text-sm text-bone">Veto: {inst.veto_notes || "N/D"}</p>
      {inst.caso_ids.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Casos:{" "}
          {inst.caso_ids.map((cid, i) => (
            <span key={cid}>
              {i > 0 ? " · " : ""}
              <Link
                href={countryPath(country, `/casos/${cid}`)}
                className="text-iris no-underline hover:text-iris-glow"
              >
                {cid}
              </Link>
            </span>
          ))}
        </p>
      )}
      {inst.fuentes.length > 0 ? (
        <ul className="space-y-1">
          {inst.fuentes.map((f) => (
            <li key={f.url} className="text-xs text-muted-foreground">
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="text-smoke no-underline hover:text-white"
              >
                {f.medio}
              </a>
              {" · "}
              {f.fecha}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">Fuentes: N/D</p>
      )}
    </div>
  );
}

function PoderMapInner({
  instituciones,
  country,
  rootLabel,
}: {
  instituciones: Institucion[];
  country: string;
  rootLabel: string;
}) {
  const graph = useMemo(
    () => buildPoderGraph(instituciones, rootLabel),
    [instituciones, rootLabel],
  );

  const [nodes, , onNodesChange] = useNodesState(graph.nodes);
  const [edges, , onEdgesChange] = useEdgesState(graph.edges);
  const [selection, setSelection] = useState<PoderSelection>(null);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const d = node.data as PoderNodeData;
    if (d.kind === "root") setSelection({ kind: "root" });
    else if (d.kind === "capa" && d.capa)
      setSelection({ kind: "capa", capa: d.capa });
    else if (d.kind === "institucion" && d.institucionId)
      setSelection({ kind: "institucion", id: d.institucionId });
  }, []);

  return (
    <div className="space-y-6">
      <div className="poder-flow h-[min(62vh,560px)] w-full border border-border bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.35}
          maxZoom={1.6}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          defaultEdgeOptions={{
            style: { stroke: "#292d30", strokeWidth: 1.5 },
            type: "smoothstep",
          }}
          className="bg-background"
        >
          <Background color="#292d30" gap={20} size={1} />
          <Controls
            showInteractive={false}
            className="!border-border !bg-muted !shadow-none [&>button]:!border-border [&>button]:!bg-background [&>button]:!fill-smoke"
          />
        </ReactFlow>
      </div>
      <DetailPanel
        selection={selection}
        instituciones={instituciones}
        country={country}
      />
    </div>
  );
}

/** Mapa de poder (React Flow) + panel de detalle al clic. */
export function PoderMap(props: {
  instituciones: Institucion[];
  country: string;
  rootLabel?: string;
}) {
  const rootLabel = props.rootLabel ?? "Mapa de poder";
  const graphKey = `${props.country}:${rootLabel}:${props.instituciones
    .map((i) => i.id)
    .join(",")}`;

  return (
    <ReactFlowProvider>
      <PoderMapInner
        key={graphKey}
        instituciones={props.instituciones}
        country={props.country}
        rootLabel={rootLabel}
      />
    </ReactFlowProvider>
  );
}
