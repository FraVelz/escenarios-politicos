"use client";

import { useParams, usePathname } from "next/navigation";
import { countryPath } from "@/lib/countries";

/** country_id activo desde la ruta `/[country]/…`. */
export function useCountryId(): string | null {
  const params = useParams();
  const raw = params?.country;
  if (typeof raw === "string" && raw.length >= 2) return raw;
  return null;
}

export function useCountryPath() {
  const countryId = useCountryId();
  const pathname = usePathname();

  function href(path = ""): string {
    if (!countryId) return path || "/";
    return countryPath(countryId, path);
  }

  /** Al cambiar de país, preserva el sufijo tras `/xx`. */
  function switchCountry(nextId: string): string {
    if (!pathname) return `/${nextId}`;
    const stripped = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    const rest = stripped === "" ? "" : stripped;
    return countryPath(nextId, rest);
  }

  return { countryId, href, switchCountry, pathname };
}
