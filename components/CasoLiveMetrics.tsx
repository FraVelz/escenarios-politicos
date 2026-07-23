"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { Caso } from "@/lib/types";
import { EvidenciaNivelBadge } from "@/components/EvidenciaBadge";
import { CasoCredibilidadPanel } from "@/components/CasoCredibilidadPanel";
import { CasoMetricsGrid } from "@/components/CasoMetricsGrid";

/** Hidrata métricas del caso desde Firestore; seed como fallback. */
export function CasoLiveMetrics({ initial }: { initial: Caso }) {
  const [caso, setCaso] = useState(initial);
  const [source, setSource] = useState<"seed" | "firestore">("seed");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "casos", initial.id));
        if (cancelled || !snap.exists()) return;
        const live = { id: snap.id, ...snap.data() } as Caso;
        if (initial.country_id && live.country_id !== initial.country_id) {
          return;
        }
        setCaso(live);
        setSource("firestore");
      } catch {
        /* keep seed */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initial.id, initial.country_id]);

  const d = caso.credibilidad_desglose;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <EvidenciaNivelBadge nivel={caso.evidencia_nivel} />
        <p className="text-xs text-muted-foreground">
          Datos: <span className="text-bone">{source}</span>
          {caso.n_menciones_candidato != null ? (
            <>
              {" "}
              · {caso.n_menciones_credibles ?? caso.n_menciones} credibles /{" "}
              {caso.n_menciones_candidato} candidatos
            </>
          ) : null}
        </p>
      </div>
      {caso.evidencia_nivel === "insuficiente" ? (
        <p className="max-w-2xl text-sm text-warn">
          Credibilidad del relato aún no es concluyente: falta contraste
          multi-fuente. El % abajo no debe leerse como conclusión firme.
        </p>
      ) : null}
      {caso.evidencia_resumen ? (
        <p className="text-xs text-muted-foreground">{caso.evidencia_resumen}</p>
      ) : null}
      <div className="grid gap-0 md:grid-cols-2">
        <div className="md:pr-0">
          <CasoCredibilidadPanel
            credibilidad={caso.credibilidad}
            especificidad={d.especificidad}
            repeticion_norm={d.repeticion_norm}
            centralidad={d.centralidad}
          />
        </div>
        <div className="md:-ml-px">
          <CasoMetricsGrid
            n_menciones={caso.n_menciones}
            especificidad={caso.especificidad}
            importancia={caso.importancia}
            factibilidad={caso.factibilidad}
            funcion_retorica={caso.funcion_retorica}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Credibilidad del relato (auditable) — no es probabilidad de
        cumplimiento.
      </p>
    </div>
  );
}
