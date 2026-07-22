"use client";

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { CredibilidadDesgloseChart } from "@/components/CredibilidadDesgloseChart";
import { CrossCell, CrossGrid } from "@/components/CrossGrid";

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
  return (
    <CrossGrid cols={1} className="grid-cols-1">
      <CrossCell>
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Credibilidad
        </p>
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
        <ul className="mt-4 space-y-1 font-mono text-[11px] text-muted-foreground">
          <li>especificidad: {especificidad} (peso 45%)</li>
          <li>repetición_norm: {repeticion_norm} (peso 25%)</li>
          <li>centralidad: {centralidad} (peso 30%)</li>
        </ul>
      </CrossCell>
    </CrossGrid>
  );
}
