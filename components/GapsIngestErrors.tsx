"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { useCountryId } from "@/lib/useCountryPath";

type IngestError = {
  id: string;
  reason?: string;
  workflow_id?: string;
  created_at?: string;
  country_id?: string;
};

export function GapsIngestErrors() {
  const countryId = useCountryId();
  const [errors, setErrors] = useState<IngestError[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "empty" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const col = collection(getDb(), "ingest_errors");
        const snap = countryId
          ? await getDocs(
              query(
                col,
                where("country_id", "==", countryId),
                orderBy("created_at", "desc"),
                limit(30),
              ),
            )
          : await getDocs(
              query(col, orderBy("created_at", "desc"), limit(30)),
            );
        if (cancelled) return;
        const rows = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as IngestError,
        );
        setErrors(rows);
        setStatus(rows.length === 0 ? "empty" : "ok");
      } catch {
        // Fallback sin orderBy (índice ausente o docs viejos sin created_at).
        try {
          const col = collection(getDb(), "ingest_errors");
          const snap = countryId
            ? await getDocs(
                query(col, where("country_id", "==", countryId), limit(30)),
              )
            : await getDocs(query(col, limit(30)));
          if (cancelled) return;
          const rows = snap.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as IngestError,
          );
          setErrors(rows);
          setStatus(rows.length === 0 ? "empty" : "ok");
        } catch {
          if (!cancelled) setStatus("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [countryId]);

  return (
    <section className="mt-14 max-w-2xl">
      <h2 className="mb-3 text-sm font-medium tracking-tight text-white">
        Errores de ingest
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Fallos del pipeline (n8n → Firestore). Payload sanitizado (sin
        secretos). Vacío no implica pipeline saludable si aún no hay runs.
      </p>
      {status === "loading" && (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      )}
      {status === "empty" && (
        <p className="text-sm text-muted-foreground">Sin ingest_errors.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-warn">
          No se pudieron leer ingest_errors (Firestore / índice).
        </p>
      )}
      {status === "ok" && (
        <ul className="divide-y divide-border border-y border-border">
          {errors.map((e) => (
            <li key={e.id} className="py-3 text-sm">
              <p className="text-bone">{e.reason || "error sin reason"}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {e.workflow_id || "N/D"}
                {e.created_at ? ` · ${e.created_at}` : ""}
                {" · "}
                {e.id}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
