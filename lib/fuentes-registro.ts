import registro from "@/content/fuentes_registro.json";

export type FuenteClase = "oficial" | "datos" | "medio";
export type FuenteLinea = "institucional" | "centro" | "critica" | "otra";

export type FuenteRegistro = {
  id: string;
  nombre: string;
  clase: FuenteClase;
  linea: FuenteLinea;
  url_base: string;
  rss_url?: string;
  activo: boolean;
  peso_contraste: number;
  country_id: string;
};

const list = registro as FuenteRegistro[];

export function listFuentesRegistro(countryId?: string): FuenteRegistro[] {
  const active = list.filter((f) => f.activo);
  if (!countryId) return active;
  return active.filter((f) => f.country_id === countryId);
}

export function getFuenteById(id: string): FuenteRegistro | undefined {
  return list.find((f) => f.id === id);
}

/** Resuelve fuente por hostname de URL. */
export function resolveFuenteFromUrl(url: string): FuenteRegistro | undefined {
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return undefined;
  }
  return list.find((f) => {
    try {
      const base = new URL(f.url_base).hostname.replace(/^www\./, "").toLowerCase();
      return host === base || host.endsWith("." + base);
    } catch {
      return false;
    }
  });
}

/** True si la URL es solo el origen (homepage), sin path de pieza. */
export function isHomepageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/+$/, "") || "/";
    return path === "/" && !u.search && !u.hash;
  } catch {
    return true;
  }
}

export function listRssFeeds(countryId = "co"): {
  fuente_id: string;
  linea: FuenteLinea;
  rss_url: string;
  nombre: string;
}[] {
  return listFuentesRegistro(countryId)
    .filter((f) => f.clase === "medio" && typeof f.rss_url === "string" && f.rss_url.length > 0)
    .map((f) => ({
      fuente_id: f.id,
      linea: f.linea,
      rss_url: f.rss_url!,
      nombre: f.nombre,
    }));
}
