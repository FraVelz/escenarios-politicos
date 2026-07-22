"use client";

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { CredibilidadDesgloseChart } from "@/components/CredibilidadDesgloseChart";
import { CrossCell, CrossGrid } from "@/components/CrossGrid";
import { Reveal, useMotionPresets } from "@/components/motion";

export function CasoCredibilidadPanel({
  credibilidad,
  especificidad,
  repeticion_norm,
  centralidad,
}: {
  credibilidad: number;
  especificidad: number;
  repeticion_norm: number;
  centralidad: number;
}) {
  const { stagger, itemBlur } = useMotionPresets();

  return (
    <Reveal y={12} delay={0.06}>
      <CrossGrid
        cols={1}
        className="grid-cols-1"
        variants={stagger(0.08)}
        initial="hidden"
        animate="show"
      >
        <CrossCell variants={itemBlur}>
          <p className="text-sm text-muted-foreground">Credibilidad</p>
          <p className="mt-2">
            <AnimatedNumber
              value={credibilidad}
              suffix="%"
              className="text-4xl sm:text-5xl"
            />
          </p>
          <div className="mt-6">
            <CredibilidadDesgloseChart
              especificidad={especificidad}
              repeticion_norm={repeticion_norm}
              centralidad={centralidad}
            />
          </div>
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            <li>especificidad: {especificidad} (peso 45%)</li>
            <li>repetición_norm: {repeticion_norm} (peso 25%)</li>
            <li>centralidad: {centralidad} (peso 30%)</li>
          </ul>
        </CrossCell>
      </CrossGrid>
    </Reveal>
  );
}
