export type EspecificidadChecklist = {
  plan_mecanismo: boolean;
  responsables_equipo: boolean;
  plazos: boolean;
  recursos: boolean;
  metricas: boolean;
  contraste_status_quo: boolean;
};

export type CredibilidadDesglose = {
  especificidad: number;
  repeticion_norm: number;
  centralidad: number;
};

const POINTS: Record<keyof EspecificidadChecklist, number> = {
  plan_mecanismo: 25,
  responsables_equipo: 20,
  plazos: 15,
  recursos: 20,
  metricas: 10,
  contraste_status_quo: 10,
};

export function scoreEspecificidad(c: EspecificidadChecklist): number {
  let s = 0;
  for (const k of Object.keys(POINTS) as (keyof EspecificidadChecklist)[]) {
    if (c[k]) s += POINTS[k];
  }
  return Math.min(100, s);
}

export function scoreRepeticion(nMenciones: number): number {
  const n = Math.max(0, nMenciones);
  if (n <= 0) return 0;
  if (n === 1) return 20;
  if (n >= 30) return 100;
  const t = Math.log10(n) / Math.log10(30);
  return Math.round(20 + t * 80);
}

export function scoreCentralidad(
  discursoIdentidad: boolean,
  nivel: "identidad" | "cierre" | "lateral" | "periferica" = "lateral",
): number {
  if (discursoIdentidad || nivel === "identidad") return 100;
  if (nivel === "cierre") return 70;
  if (nivel === "periferica") return 10;
  return 20;
}

export function calcularCredibilidad(input: {
  checklist: EspecificidadChecklist;
  nMenciones: number;
  discursoIdentidad: boolean;
  centralidadNivel?: "identidad" | "cierre" | "lateral" | "periferica";
}): { credibilidad: number; desglose: CredibilidadDesglose } {
  const especificidad = scoreEspecificidad(input.checklist);
  const repeticion_norm = scoreRepeticion(input.nMenciones);
  const centralidad = scoreCentralidad(
    input.discursoIdentidad,
    input.discursoIdentidad ? "identidad" : input.centralidadNivel,
  );
  const credibilidad = Math.round(
    Math.min(
      100,
      Math.max(
        0,
        0.45 * especificidad + 0.25 * repeticion_norm + 0.3 * centralidad,
      ),
    ),
  );
  return {
    credibilidad,
    desglose: { especificidad, repeticion_norm, centralidad },
  };
}
