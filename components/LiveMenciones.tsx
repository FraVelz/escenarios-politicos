"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { Mencion } from "@/lib/types";

export function useLiveMenciones(
  initial: Mencion[],
  opts?: { casoId?: string; countryId?: string | null },
) {
  const casoId = opts?.casoId;
  const countryId = opts?.countryId;
  const [menciones, setMenciones] = useState(initial);
  const [source, setSource] = useState<"seed" | "firestore">("seed");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const col = collection(getDb(), "menciones");
        // Prefer single-field queries to avoid composite indexes.
        const snap = casoId
          ? await getDocs(query(col, where("caso_id", "==", casoId)))
          : countryId
            ? await getDocs(query(col, where("country_id", "==", countryId)))
            : await getDocs(col);
        if (cancelled || snap.empty) return;
        let live = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Mencion,
        );
        if (countryId) {
          live = live.filter((m) => m.country_id === countryId);
        }
        if (casoId) {
          live = live.filter((m) => m.caso_id === casoId);
        }
        if (live.length === 0) return;
        setMenciones(live);
        setSource("firestore");
      } catch {
        /* keep seed */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [casoId, countryId]);

  return { menciones, source };
}
