"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import {
  listAvailableCountriesSync,
  listPaisesSeed,
} from "@/lib/countries";
import { useCountryPath } from "@/lib/useCountryPath";
import type { PaisMeta } from "@/lib/types";
import { focusRingNav } from "@/lib/focus";
import { cn } from "@/lib/utils";

function mergeAvailable(
  seedAvail: PaisMeta[],
  liveIds: Set<string>,
): PaisMeta[] {
  const catalog = listPaisesSeed();
  const ids = new Set(seedAvail.map((p) => p.id));
  for (const id of liveIds) ids.add(id);
  return catalog.filter((p) => ids.has(p.id));
}

export function CountrySwitcher({
  initial,
}: {
  initial: PaisMeta[];
}) {
  const [countries, setCountries] = useState(initial);
  const { countryId, switchCountry } = useCountryPath();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const db = getDb();
        const ids = new Set<string>();
        for (const colName of ["casos", "marco"] as const) {
          const snap = await getDocs(collection(db, colName));
          for (const doc of snap.docs) {
            const cid = doc.data()?.country_id;
            if (typeof cid === "string" && cid.length >= 2) ids.add(cid);
          }
        }
        if (cancelled || ids.size === 0) return;
        setCountries(mergeAvailable(listAvailableCountriesSync(), ids));
      } catch {
        /* keep seed */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Un solo país: el nombre ya está en la marca — no duplicar chip.
  if (countries.length <= 1) return null;

  const active =
    countries.find((c) => c.id === countryId) ?? countries[0];

  return (
    <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
      <span className="sr-only">País</span>
      <select
        className={cn(
          "border border-border bg-black px-2 py-1 text-xs text-bone outline-none",
          focusRingNav,
        )}
        value={active.id}
        onChange={(e) => {
          router.push(switchCountry(e.target.value));
        }}
        aria-label="Seleccionar país"
      >
        {countries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre_corto}
          </option>
        ))}
      </select>
    </label>
  );
}
