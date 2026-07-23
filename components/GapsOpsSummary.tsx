"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { useCountryId } from "@/lib/useCountryPath";

type RunSummary = {
  id?: string;
  status?: string;
  started_at?: string;
  finished_at?: string;
  n_ok?: number;
  n_error?: number;
};

type OpsSummary = {
  updated_at?: string;
  raw_queue_size?: number;
  last_wf_c?: RunSummary;
  last_wf_d?: RunSummary;
  last_wf_a?: RunSummary;
  last_wf_b?: RunSummary;
  last_wf_e?: RunSummary;
};

export function GapsOpsSummary() {
  const countryId = useCountryId();
  const [ops, setOps] = useState<OpsSummary | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "empty" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = countryId || "co";
        const snap = await getDoc(doc(getDb(), "ops_summary", id));
        if (cancelled) return;
        if (!snap.exists()) {
          setStatus("empty");
          return;
        }
        setOps(snap.data() as OpsSummary);
        setStatus("ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [countryId]);

  const rows: { label: string; run?: RunSummary }[] = [
    { label: "WF-A macro", run: ops?.last_wf_a },
    { label: "WF-B oficiales", run: ops?.last_wf_b },
    { label: "WF-C RSS", run: ops?.last_wf_c },
    { label: "WF-D clasificar", run: ops?.last_wf_d },
    { label: "WF-E alertas", run: ops?.last_wf_e },
  ];

  return (
    <section className="mt-14 max-w-2xl">
      <h2 className="mb-3 text-sm font-medium tracking-tight text-white">
        Operación del pipeline
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Últimas corridas conocidas y estado agregado (sin secretos).
      </p>
      {status === "loading" && (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      )}
      {status === "empty" && (
        <p className="text-sm text-muted-foreground">
          Sin ops_summary — el pipeline aún no ha registrado corridas.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-warn">No se pudo leer ops_summary.</p>
      )}
      {status === "ok" && ops && (
        <div className="space-y-3 text-sm">
          {typeof ops.raw_queue_size === "number" ? (
            <p className="text-muted-foreground">
              Cola raw pendiente (hint):{" "}
              <span className="text-bone">{ops.raw_queue_size}</span>
            </p>
          ) : null}
          <ul className="divide-y divide-border border-y border-border">
            {rows.map(({ label, run }) => (
              <li key={label} className="py-3">
                <p className="text-bone">{label}</p>
                {run ? (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {run.status || "N/D"}
                    {run.finished_at || run.started_at
                      ? ` · ${run.finished_at || run.started_at}`
                      : ""}
                    {run.n_ok != null ? ` · ok=${run.n_ok}` : ""}
                    {run.n_error != null ? ` · err=${run.n_error}` : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">N/D</p>
                )}
              </li>
            ))}
          </ul>
          {ops.updated_at ? (
            <p className="text-xs text-muted-foreground">
              actualizado {ops.updated_at}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
