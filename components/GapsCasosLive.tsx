"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { gapsFromCasos } from "@/lib/gaps";
import { GapsGrid } from "@/components/GapsGrid";
import { EmptyState } from "@/components/EmptyState";
import type { Caso } from "@/lib/types";
import { useCountryId } from "@/lib/useCountryPath";

export function GapsCasosLive({
  initialGaps,
}: {
  initialGaps: { caso_id: string; campos: string[] }[];
}) {
  const countryId = useCountryId();
  const [gaps, setGaps] = useState(initialGaps);
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
        let casos = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Caso);
        if (countryId) {
          casos = casos.filter((c) => c.country_id === countryId);
        }
        if (casos.length === 0) return;
        setGaps(gapsFromCasos(casos));
        setSource("firestore");
      } catch {
        /* keep seed */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [countryId]);

  return (
    <section>
      <p className="mb-4 text-sm text-muted-foreground">
        Gaps de casos · datos: <span className="text-bone">{source}</span>
      </p>
      {gaps.length === 0 ? (
        <EmptyState
          title="Sin gaps de casos"
          description="Todos los casos tienen importancia y factibilidad asignadas (y sin pendientes de contraste)."
        />
      ) : (
        <GapsGrid gaps={gaps} />
      )}
    </section>
  );
}
