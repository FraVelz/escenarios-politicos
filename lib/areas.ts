/** Áreas temáticas para agrupar casos (Colombia) — 12 temas. */
export const AREA_ORDER = [
  "paz_seguridad",
  "empleo",
  "fiscal",
  "salud",
  "educacion",
  "infraestructura",
  "vivienda_social",
  "justicia",
  "exterior",
  "energia_clima",
  "agro_rural",
  "tecnologia_estado",
] as const;

export type AreaId = (typeof AREA_ORDER)[number];

export const AREA_LABELS: Record<AreaId, string> = {
  paz_seguridad: "Paz y seguridad",
  empleo: "Empleo y economía laboral",
  fiscal: "Fiscal y macro",
  salud: "Salud",
  educacion: "Educación",
  infraestructura: "Infraestructura y movilidad",
  vivienda_social: "Vivienda y política social",
  justicia: "Justicia e instituciones",
  exterior: "Política exterior",
  energia_clima: "Energía y clima",
  agro_rural: "Agro y desarrollo rural",
  tecnologia_estado: "Tecnología y Estado digital",
};

export function areaLabel(area: string | undefined): string {
  if (!area) return "Sin área";
  return AREA_LABELS[area as AreaId] ?? area;
}
