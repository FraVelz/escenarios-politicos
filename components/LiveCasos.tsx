"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { Caso } from "@/lib/types";

/** Hidrata casos desde Firestore (lectura). Fallback: props iniciales. */
export function useLiveCasos(initial: Caso[]) {
  const [casos, setCasos] = useState(initial);
  const [source, setSource] = useState<"seed" | "firestore">("seed");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(getDb(), "casos"));
        if (cancelled || snap.empty) return;
        const live = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Caso);
        setCasos(live);
        setSource("firestore");
      } catch {
        /* keep seed */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { casos, source };
}
