import { NextRequest, NextResponse } from "next/server";
import { clientKey, requireIngestSecret } from "@/lib/ingest-auth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  checkRateLimit,
  ingestRateLimitConfig,
} from "@/lib/rate-limit";
import type { Caso } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Materializa alertas del playbook desde casos en Firestore.
 * Header: x-ingest-secret
 */
export async function POST(req: NextRequest) {
  const authErr = requireIngestSecret(req);
  if (authErr) return authErr;

  const { limit, windowMs } = ingestRateLimitConfig();
  const rl = checkRateLimit(`alertas:${clientKey(req)}`, limit, windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded", retry_after_sec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const countryId = req.nextUrl.searchParams.get("country_id") || "co";
  const runId = `run-wf-e-${Date.now()}`;
  const started = new Date().toISOString();
  const db = getAdminDb();

  const snap = await db
    .collection("casos")
    .where("country_id", "==", countryId)
    .get();
  const casos = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Caso);
  const created_at = new Date().toISOString();
  const alertas: {
    id: string;
    country_id: string;
    workflow_id: string;
    tipo: string;
    caso_id: string;
    mensaje: string;
    created_at: string;
  }[] = [];

  for (const c of casos) {
    if (c.discurso_identidad) {
      alertas.push({
        id: `alerta-identidad-${c.id}`,
        country_id: countryId,
        workflow_id: "wf-e-alertas",
        tipo: "discurso_identidad",
        caso_id: c.id,
        mensaje: "Discurso identidad — priorizar en home",
        created_at,
      });
    }
    if (
      (c.n_menciones_credibles ?? c.n_menciones) >= 10 &&
      c.especificidad < 20
    ) {
      alertas.push({
        id: `alerta-ruido-${c.id}`,
        country_id: countryId,
        workflow_id: "wf-e-alertas",
        tipo: "ruido_vacio",
        caso_id: c.id,
        mensaje: "Alta frecuencia + baja especificidad",
        created_at,
      });
    }
    if (c.credibilidad >= 60 && c.factibilidad === "baja") {
      alertas.push({
        id: `alerta-cred-fact-${c.id}`,
        country_id: countryId,
        workflow_id: "wf-e-alertas",
        tipo: "credibilidad_alta_factibilidad_baja",
        caso_id: c.id,
        mensaje: "Relato fuerte, ejecución difícil",
        created_at,
      });
    }
    if (
      c.evidencia_nivel === "insuficiente" ||
      (c.campos_pendientes || []).includes("evidencia_contraste")
    ) {
      alertas.push({
        id: `alerta-evidencia-${c.id}`,
        country_id: countryId,
        workflow_id: "wf-e-alertas",
        tipo: "evidencia_insuficiente",
        caso_id: c.id,
        mensaje: "Sin contraste multi-fuente — no concluir",
        created_at,
      });
    }
    if (c.importancia === "N/D" || c.factibilidad === "N/D") {
      alertas.push({
        id: `alerta-nd-${c.id}`,
        country_id: countryId,
        workflow_id: "wf-e-alertas",
        tipo: "campos_nd",
        caso_id: c.id,
        mensaje: "Campos N/D (importancia/factibilidad)",
        created_at,
      });
    }
  }

  const batch = db.batch();
  for (const a of alertas) {
    batch.set(db.collection("alertas").doc(a.id), a, { merge: true });
  }
  await batch.commit();

  const finished = new Date().toISOString();
  await db.collection("ingest_runs").doc(runId).set({
    id: runId,
    workflow_id: "wf-e-alertas",
    started_at: started,
    finished_at: finished,
    status: "ok",
    country_id: countryId,
    n_ok: alertas.length,
    n_error: 0,
    stats: { casos: casos.length },
  });

  await db.collection("ops_summary").doc(countryId).set(
    {
      id: countryId,
      country_id: countryId,
      updated_at: finished,
      last_wf_e: {
        id: runId,
        status: "ok",
        started_at: started,
        finished_at: finished,
        n_ok: alertas.length,
        n_error: 0,
      },
    },
    { merge: true },
  );

  return NextResponse.json({
    ok: true,
    run_id: runId,
    n_alertas: alertas.length,
    n_casos: casos.length,
  });
}
