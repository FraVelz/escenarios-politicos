import type { CapaPoder } from "./types";

export const CAPA_ORDER: CapaPoder[] = [
  "ejecutivo",
  "legislativo",
  "judicial",
  "macro",
  "seguridad",
  "regional",
  "elites",
];

export const CAPA_LABELS: Record<CapaPoder, string> = {
  ejecutivo: "Ejecutivo",
  legislativo: "Legislativo",
  judicial: "Judicial / control",
  macro: "Macro / banca central",
  seguridad: "Seguridad",
  regional: "Regional",
  elites: "Élites",
};
