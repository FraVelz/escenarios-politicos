"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { Mencion } from "@/lib/types";

export function useLiveMenciones(initial: Mencion[], casoId?: string) {
  const [menciones, setMenciones] = useState(initial);
  const [source, setSource] = useState<"seed" | "firestore">("seed");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const col = collection(getDb(), "menciones");
        const snap = casoId
          ? await getDocs(query(col, where("caso_id", "==", casoId)))
          : await getDocs(col);
        if (cancelled || snap.empty) return;
        const live = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Mencion,
        );
        setMenciones(live);
        setSource("firestore");
      } catch {
        /* keep seed */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [casoId]);

  return { menciones, source };
}
