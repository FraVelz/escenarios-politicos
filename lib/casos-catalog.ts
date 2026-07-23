/**
 * Catálogo CO de casos para emparejar raw_items (WF-D).
 * No inventar casos desde titulares: solo IDs listados.
 */

export type CasoCatalogEntry = {
  id: string;
  actor_id: string;
  area: string;
  keys: string[];
};

export const CASOS_CATALOG_CO: CasoCatalogEntry[] = [
  {
    id: "paz-total-identidad",
    actor_id: "co-abelardo-espriella",
    area: "paz_seguridad",
    keys: ["paz total", "paz con legalidad", "negociacion de paz"],
  },
  {
    id: "seguridad-rural-eslogan",
    actor_id: "co-abelardo-espriella",
    area: "paz_seguridad",
    keys: ["seguridad rural", "seguridad en el campo"],
  },
  {
    id: "empleo-con-plan",
    actor_id: "co-abelardo-espriella",
    area: "empleo",
    keys: ["empleo formal", "plan de empleo", "trabajo formal"],
  },
  {
    id: "empleo-eslogan",
    actor_id: "co-abelardo-espriella",
    area: "empleo",
    keys: ["crear empleo", "empleo para todos"],
  },
  {
    id: "reforma-fiscal-tecnica",
    actor_id: "co-abelardo-espriella",
    area: "fiscal",
    keys: ["reforma fiscal", "reforma tributaria"],
  },
  {
    id: "regla-fiscal-relajacion",
    actor_id: "co-abelardo-espriella",
    area: "fiscal",
    keys: ["regla fiscal"],
  },
  {
    id: "salud-plan-hospitales",
    actor_id: "co-abelardo-espriella",
    area: "salud",
    keys: ["red hospitalaria", "hospitales regionales", "plan de salud"],
  },
  {
    id: "salud-eslogan-gratis",
    actor_id: "co-abelardo-espriella",
    area: "salud",
    keys: ["salud gratis", "salud gratuita"],
  },
  {
    id: "educacion-jornada-unica",
    actor_id: "co-abelardo-espriella",
    area: "educacion",
    keys: ["jornada unica", "jornada única"],
  },
  {
    id: "infra-metro-regional",
    actor_id: "co-abelardo-espriella",
    area: "infraestructura",
    keys: ["metro regional", "metro de"],
  },
  {
    id: "vivienda-subsidios",
    actor_id: "co-abelardo-espriella",
    area: "vivienda_social",
    keys: ["subsidio de vivienda", "vivienda social"],
  },
  {
    id: "justicia-reforma-procesal",
    actor_id: "co-abelardo-espriella",
    area: "justicia",
    keys: ["reforma procesal", "reforma a la justicia"],
  },
  {
    id: "exterior-discurso-soberania",
    actor_id: "co-abelardo-espriella",
    area: "exterior",
    keys: ["soberania", "soberanía", "politica exterior"],
  },
  {
    id: "energia-transicion-electo",
    actor_id: "co-abelardo-espriella",
    area: "energia_clima",
    keys: ["transicion energetica", "transición energética"],
  },
  {
    id: "agro-seguridad-alimentaria",
    actor_id: "co-abelardo-espriella",
    area: "agro_rural",
    keys: ["seguridad alimentaria", "agroindustria"],
  },
  {
    id: "estado-digital-tramites",
    actor_id: "co-abelardo-espriella",
    area: "tecnologia_estado",
    keys: ["estado digital", "tramites digitales", "trámites digitales"],
  },
];

const TITLE_BLACKLIST = [
  /^portada$/i,
  /^últimas noticias$/i,
  /^ultimas noticias$/i,
  /^en vivo$/i,
  /^opinión$/i,
  /^opinion$/i,
];

export function isBlacklistedTitle(title: string): boolean {
  const t = String(title || "").trim();
  if (t.length < 12) return true;
  return TITLE_BLACKLIST.some((re) => re.test(t));
}

/**
 * Empareja texto a catálogo. Preferir keys más largas.
 * score mínimo = longitud de la key más corta aceptable (8).
 */
export function matchCasoCatalog(
  text: string,
  explicitId?: string | null,
  catalog: CasoCatalogEntry[] = CASOS_CATALOG_CO,
): CasoCatalogEntry | null {
  if (explicitId && catalog.some((c) => c.id === explicitId)) {
    return catalog.find((c) => c.id === explicitId) || null;
  }
  const t = String(text || "").toLowerCase();
  let best: CasoCatalogEntry | null = null;
  let bestScore = 0;
  for (const c of catalog) {
    let score = 0;
    for (const k of c.keys) {
      if (t.includes(k.toLowerCase())) score += k.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  // umbral: al menos una key de 8+ chars
  return bestScore >= 8 ? best : null;
}
