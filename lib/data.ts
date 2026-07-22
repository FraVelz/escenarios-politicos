import seedCasos from "@/content/seed/casos.json";
import seedMenciones from "@/content/seed/menciones.json";
import type { Alerta, Caso, Mencion } from "./types";

export function listCasosSync(): Caso[] {
  return seedCasos as Caso[];
}

export function getCasoSync(id: string): Caso | null {
  return (seedCasos as Caso[]).find((c) => c.id === id) ?? null;
}

export function listMencionesSync(casoId?: string): Mencion[] {
  const all = seedMenciones as Mencion[];
  return casoId ? all.filter((m) => m.caso_id === casoId) : all;
}

export function listAlertasSync(): Alerta[] {
  return [
    {
      id: "ruido-empleo-eslogan",
      tipo: "ruido_vacio",
      caso_id: "empleo-eslogan",
      mensaje: "Alta frecuencia + baja especificidad",
      created_at: "2026-07-21T20:00:00Z",
    },
    {
      id: "identidad-paz-factibilidad",
      tipo: "credibilidad_alta_factibilidad_baja",
      caso_id: "paz-total-identidad",
      mensaje: "Discurso identidad con factibilidad baja",
      created_at: "2026-07-21T20:00:00Z",
    },
  ];
}

export function gapsFromCasos(casos: Caso[]): { caso_id: string; campos: string[] }[] {
  return casos
    .filter(
      (c) =>
        (c.campos_pendientes?.length ?? 0) > 0 ||
        c.importancia === "N/D" ||
        c.factibilidad === "N/D",
    )
    .map((c) => ({
      caso_id: c.id,
      campos: [
        ...(c.campos_pendientes ?? []),
        ...(c.importancia === "N/D" ? ["importancia"] : []),
        ...(c.factibilidad === "N/D" ? ["factibilidad"] : []),
      ].filter((v, i, a) => a.indexOf(v) === i),
    }));
}
