import seedPaises from "@/content/seed/paises.json";
import seedCasos from "@/content/seed/casos.json";
import seedMarco from "@/content/seed/marco.json";
import type { Caso, MarcoPolitico, PaisMeta } from "./types";

export function listPaisesSeed(): PaisMeta[] {
  return seedPaises as PaisMeta[];
}

export function getPaisMeta(id: string): PaisMeta | null {
  return listPaisesSeed().find((p) => p.id === id) ?? null;
}

/** IDs con al menos un caso o marco en seed. */
export function seedCountryIdsWithData(): Set<string> {
  const ids = new Set<string>();
  for (const c of seedCasos as Caso[]) {
    if (c.country_id) ids.add(c.country_id);
  }
  const marco = seedMarco as MarcoPolitico;
  if (marco.country_id) ids.add(marco.country_id);
  return ids;
}

/**
 * Países del catálogo que tienen datos analizados en seed.
 * Nunca lista países “vacíos” solo porque existan en un catálogo mundial.
 */
export function listAvailableCountriesSync(): PaisMeta[] {
  const withData = seedCountryIdsWithData();
  return listPaisesSeed().filter((p) => withData.has(p.id));
}

export function defaultCountryIdSync(): string | null {
  const avail = listAvailableCountriesSync();
  return avail[0]?.id ?? null;
}

export function isCountryAvailableSync(id: string): boolean {
  return listAvailableCountriesSync().some((p) => p.id === id);
}

export function countryPath(countryId: string, path = ""): string {
  const clean = path.startsWith("/") ? path : path ? `/${path}` : "";
  if (!clean || clean === "/") return `/${countryId}`;
  return `/${countryId}${clean}`;
}

/** Extrae country_id del pathname `/co/casos` → `co`. */
export function countryFromPathname(pathname: string): string | null {
  const m = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  if (!m) return null;
  return isCountryAvailableSync(m[1]) ? m[1] : null;
}
