import type { Caso } from "./types";

export function gapsFromCasos(
  casos: Caso[],
): { caso_id: string; campos: string[] }[] {
  const out: { caso_id: string; campos: string[] }[] = [];
  for (const c of casos) {
    const campos = [
      ...(c.campos_pendientes ?? []),
      ...(c.importancia === "N/D" ? ["importancia"] : []),
      ...(c.factibilidad === "N/D" ? ["factibilidad"] : []),
    ].filter((v, i, a) => a.indexOf(v) === i);
    if (campos.length === 0) continue;
    out.push({ caso_id: c.id, campos });
  }
  return out;
}
