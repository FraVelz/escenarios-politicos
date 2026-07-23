"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { Indicador } from "@/lib/types";
import { useCountryId } from "@/lib/useCountryPath";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

export function IndicadoresPanel({
  initial = [],
}: {
  initial?: Indicador[];
}) {
  const countryId = useCountryId();
  const [rows, setRows] = useState<Indicador[]>(initial);
  const [source, setSource] = useState<"seed" | "firestore">("seed");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const col = collection(getDb(), "indicadores");
        const snap = countryId
          ? await getDocs(query(col, where("country_id", "==", countryId)))
          : await getDocs(col);
        if (cancelled || snap.empty) return;
        let live = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Indicador,
        );
        if (countryId) {
          live = live.filter((i) => i.country_id === countryId);
        }
        if (live.length === 0) return;
        setRows(live);
        setSource("firestore");
      } catch {
        /* keep seed */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [countryId]);

  if (rows.length === 0) {
    return (
      <section className="max-w-2xl">
        <h2 className="mb-2 text-base font-medium text-white">Indicadores</h2>
        <p className="text-sm text-muted-foreground">
          N/D — sin indicadores cargados aún.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl">
      <h2 className="mb-1 text-base font-medium text-white">Indicadores</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Macro P3 · datos: <span className="text-bone">{source}</span>. Toda
        cifra: valor + fecha + fuente.
      </p>
      <ul className="divide-y divide-border border-y border-border">
        {rows.map((ind) => (
          <li key={ind.id} className="space-y-1 py-4">
            <p className="text-sm text-white">
              {ind.nombre || ind.codigo}:{" "}
              <span className="text-iris">
                {ind.valor}
                {ind.unidad ? ` ${ind.unidad}` : ""}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              fecha {ind.fecha} · {ind.workflow_id}
            </p>
            {ind.fuente_url ? (
              <a
                href={ind.fuente_url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-block text-xs text-smoke no-underline hover:text-white",
                  focusRingInline,
                )}
              >
                Fuente →
              </a>
            ) : (
              <span className="text-xs text-muted-foreground">Fuente: N/D</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
