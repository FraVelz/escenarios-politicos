"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { Caso } from "@/lib/types";

/** Hidrata casos desde Firestore (lectura). Fallback: props iniciales. */
export function useLiveCasos(initial: Caso[], countryId?: string | null) {
  const [casos, setCasos] = useState(initial);
  const [source, setSource] = useState<"seed" | "firestore">("seed");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const col = collection(getDb(), "casos");
        const snap = countryId
          ? await getDocs(query(col, where("country_id", "==", countryId)))
          : await getDocs(col);
        if (cancelled || snap.empty) return;
        const live = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Caso);
        const filtered = countryId
          ? live.filter((c) => c.country_id === countryId)
          : live;
        if (filtered.length === 0) return;
        setCasos(filtered);
        setSource("firestore");
      } catch {
        /* keep seed */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [countryId]);

  return { casos, source };
}
