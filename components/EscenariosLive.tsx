"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { EscenarioSeed, SenalSeed } from "@/lib/types";
import { EmptyState } from "@/components/EmptyState";
import { useCountryId } from "@/lib/useCountryPath";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

export function EscenariosLive({
  initialEscenarios,
  initialSenales,
}: {
  initialEscenarios: EscenarioSeed[];
  initialSenales: SenalSeed[];
}) {
  const countryId = useCountryId();
  const [escenarios, setEscenarios] = useState(initialEscenarios);
  const [senales, setSenales] = useState(initialSenales);
  const [source, setSource] = useState<"seed" | "firestore">("seed");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [escSnap, senSnap] = await Promise.all([
          countryId
            ? getDocs(
                query(
                  collection(getDb(), "escenarios"),
                  where("country_id", "==", countryId),
                ),
              )
            : getDocs(collection(getDb(), "escenarios")),
          countryId
            ? getDocs(
                query(
                  collection(getDb(), "senales"),
                  where("country_id", "==", countryId),
                ),
              )
            : getDocs(collection(getDb(), "senales")),
        ]);
        if (cancelled) return;
        let esc = escSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as EscenarioSeed,
        );
        let sen = senSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as SenalSeed,
        );
        if (countryId) {
          esc = esc.filter((e) => e.country_id === countryId);
          sen = sen.filter((s) => s.country_id === countryId);
        }
        if (esc.length === 0 && sen.length === 0) return;
        if (esc.length > 0) setEscenarios(esc);
        if (sen.length > 0) setSenales(sen);
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
    <>
      <p className="mb-6 text-sm text-muted-foreground">
        Datos: <span className="text-bone">{source}</span>
      </p>

      {escenarios.length === 0 ? (
        <EmptyState
          title="Sin escenarios"
          description="N/D — no hay escenarios tipados para este país."
        />
      ) : (
        <section className="mb-12" aria-labelledby="escenarios-list">
          <h2
            id="escenarios-list"
            className="mb-4 text-lg font-medium tracking-tight text-white"
          >
            Escenarios
          </h2>
          <ul className="divide-y divide-border border-y border-border">
            {escenarios.map((e) => (
              <li key={e.id} className="space-y-2 py-5">
                <p className="text-xs uppercase tracking-[0.12em] text-iris">
                  {e.tipo} · {e.horizonte_dias}d
                </p>
                <h3 className="text-base font-medium text-white">{e.titulo}</h3>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  {e.resumen}
                </p>
                {e.fuente_url ? (
                  <a
                    href={e.fuente_url}
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
                  <span className="text-xs text-muted-foreground">
                    Fuente: N/D
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="senales-list">
        <h2
          id="senales-list"
          className="mb-4 text-lg font-medium tracking-tight text-white"
        >
          Señales
        </h2>
        {senales.length === 0 ? (
          <EmptyState
            title="Sin señales"
            description="N/D — no hay señales cargadas."
          />
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {senales.map((s) => (
              <li key={s.id} className="space-y-1 py-4">
                <h3 className="text-base text-white">{s.titulo}</h3>
                <p className="text-sm text-muted-foreground">{s.detalle}</p>
                {s.fuente_url ? (
                  <a
                    href={s.fuente_url}
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
                  <span className="text-xs text-muted-foreground">
                    Fuente: N/D
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
