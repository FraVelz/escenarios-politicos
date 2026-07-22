"use client";

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { CredibilidadDesgloseChart } from "@/components/CredibilidadDesgloseChart";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardDescription>Credibilidad</CardDescription>
        <CardTitle className="flex items-baseline gap-1">
          <AnimatedNumber value={credibilidad} suffix="%" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={credibilidad} className="h-2" />
        <CredibilidadDesgloseChart
          especificidad={especificidad}
          repeticion_norm={repeticion_norm}
          centralidad={centralidad}
        />
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>especificidad: {especificidad} (peso 45%)</li>
          <li>repetición_norm: {repeticion_norm} (peso 25%)</li>
          <li>centralidad: {centralidad} (peso 30%)</li>
        </ul>
      </CardContent>
    </Card>
  );
}
