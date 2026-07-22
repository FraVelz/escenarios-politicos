"use client";

import { CrossCell, CrossGrid } from "@/components/CrossGrid";
import { Reveal, useMotionPresets } from "@/components/motion";

export function CasoMetricsGrid({
  n_menciones,
  especificidad,
  importancia,
  factibilidad,
  funcion_retorica,
}: {
  n_menciones: number;
  especificidad: number;
  importancia: string;
  factibilidad: string;
  funcion_retorica?: string | null;
}) {
  const { stagger, itemBlur } = useMotionPresets();

  return (
    <Reveal y={12} delay={0.1}>
      <CrossGrid
        cols={2}
        className="h-full sm:grid-cols-2"
        variants={stagger(0.05)}
        initial="hidden"
        animate="show"
      >
        <CrossCell variants={itemBlur}>
          <p className="text-sm text-muted-foreground">Menciones</p>
          <p className="mt-1 text-lg tabular-nums text-white">{n_menciones}</p>
        </CrossCell>
        <CrossCell variants={itemBlur}>
          <p className="text-sm text-muted-foreground">Especificidad</p>
          <p className="mt-1 text-lg tabular-nums text-white">{especificidad}</p>
        </CrossCell>
        <CrossCell variants={itemBlur}>
          <p className="text-sm text-muted-foreground">Importancia</p>
          <p className="mt-1 text-base text-bone">{importancia}</p>
        </CrossCell>
        <CrossCell variants={itemBlur}>
          <p className="text-sm text-muted-foreground">Factibilidad</p>
          <p className="mt-1 text-base text-bone">{factibilidad}</p>
        </CrossCell>
        <CrossCell
          variants={itemBlur}
          className="col-span-full sm:col-span-2"
        >
          <p className="text-sm text-muted-foreground">Función</p>
          <p className="mt-1 text-base text-bone">
            {funcion_retorica ?? "N/D"}
          </p>
        </CrossCell>
      </CrossGrid>
    </Reveal>
  );
}
