import { NextRequest, NextResponse } from "next/server";
import { clientKey, requireIngestSecret } from "@/lib/ingest-auth";
import {
  consolidarCasoFromMenciones,
  promoteMencionesContraste,
} from "@/lib/consolidar-caso";
import { matchCasoCatalog, isBlacklistedTitle } from "@/lib/casos-catalog";
import { heuristicChecklistFromText } from "@/lib/evidencia";
import { isHomepageUrl } from "@/lib/fuentes-registro";
import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  checkRateLimit,
  ingestRateLimitConfig,
} from "@/lib/rate-limit";
import type { MencionEvidencia } from "@/lib/evidencia";

export const runtime = "nodejs";

/**
 * Clasifica raw_items pendientes → menciones (candidato) + marca cola.
 * Header: x-ingest-secret
 */
export async function POST(req: NextRequest) {
  const authErr = requireIngestSecret(req);
  if (authErr) return authErr;

  const { limit, windowMs } = ingestRateLimitConfig();
  const rl = checkRateLimit(`classify:${clientKey(req)}`, limit, windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded", retry_after_sec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const countryId = req.nextUrl.searchParams.get("country_id") || "co";
  const maxItems = Math.min(
    40,
    Math.max(1, Number(req.nextUrl.searchParams.get("limit") || 40)),
  );
  const runId = `run-wf-d-${Date.now()}`;
  const started = new Date().toISOString();
  const db = getAdminDb();

  const snap = await db
    .collection("raw_items")
    .where("country_id", "==", countryId)
    .where("clasificado", "==", false)
    .limit(maxItems)
    .get();

  let nOk = 0;
  let nErr = 0;
  const touchedCasos = new Set<string>();

  for (const doc of snap.docs) {
    const raw = doc.data();
    const url = String(raw.url || "");
    const titulo = String(raw.titulo || "N/D");
    const resumen = String(raw.resumen || "");

    const fail = async (reason: string) => {
      nErr += 1;
      const errId = `err-wf-d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      await db.collection("ingest_errors").doc(errId).set({
        id: errId,
        country_id: countryId,
        workflow_id: "wf-d-clasificar",
        reason,
        created_at: new Date().toISOString(),
        payload: {
          url: url || null,
          titulo: titulo.slice(0, 120),
          fecha: raw.fecha || null,
        },
      });
      await doc.ref.set(
        {
          clasificado: true,
          estado_cola: reason === "unmatched_caso" ? "procesado" : "error",
          workflow_id: "wf-d-clasificar",
        },
        { merge: true },
      );
    };

    if (!url) {
      await fail("missing url");
      continue;
    }
    if (isHomepageUrl(url)) {
      await fail("url_no_especifica");
      continue;
    }
    if (isBlacklistedTitle(titulo)) {
      await fail("blacklisted_or_short_title");
      continue;
    }

    const hit = matchCasoCatalog(
      [titulo, resumen, raw.caso_id].filter(Boolean).join(" "),
      typeof raw.caso_id === "string" ? raw.caso_id : null,
    );
    if (!hit) {
      await fail("unmatched_caso");
      continue;
    }

    const cita = String(resumen || titulo).slice(0, 280) || "N/D";
    const checklist = heuristicChecklistFromText(cita);
    const mencionId = `men-${Buffer.from(`${url}|${hit.id}`).toString("base64url").slice(0, 28)}`;
    const mencion = {
      id: mencionId,
      country_id: countryId,
      caso_id: hit.id,
      actor_id: hit.actor_id,
      fecha: raw.fecha || "N/D",
      url,
      cita_corta: cita,
      tipo_pieza: "noticia" as const,
      ingerido_en: new Date().toISOString(),
      workflow_id: "wf-d-clasificar",
      evidencia_checklist: checklist,
      fuente_id: raw.fuente_id || undefined,
      fuente_clase: "medio" as const,
      fuente_linea: raw.linea || "otra",
      evidencia_estado: "candidato" as const,
    };

    await db.collection("menciones").doc(mencionId).set(mencion, { merge: true });
    await doc.ref.set(
      {
        clasificado: true,
        estado_cola: "procesado",
        workflow_id: "wf-d-clasificar",
      },
      { merge: true },
    );
    touchedCasos.add(hit.id);
    nOk += 1;
  }

  for (const casoId of touchedCasos) {
    const casoSnap = await db.collection("casos").doc(casoId).get();
    if (!casoSnap.exists) continue;
    const mencionesSnap = await db
      .collection("menciones")
      .where("caso_id", "==", casoId)
      .get();
    const menciones = mencionesSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as (MencionEvidencia & { id: string })[];
    const promoted = promoteMencionesContraste(menciones);
    const batch = db.batch();
    for (let i = 0; i < menciones.length; i++) {
      if (menciones[i]!.evidencia_estado !== promoted[i]!.evidencia_estado) {
        batch.set(
          db.collection("menciones").doc(menciones[i]!.id),
          { evidencia_estado: promoted[i]!.evidencia_estado },
          { merge: true },
        );
      }
    }
    await batch.commit();
    const patch = consolidarCasoFromMenciones(casoSnap.data() || {}, promoted);
    await db.collection("casos").doc(casoId).set(patch, { merge: true });
  }

  const finished = new Date().toISOString();
  const status = nErr && nOk ? "partial" : nErr && !nOk ? "error" : "ok";
  await db.collection("ingest_runs").doc(runId).set({
    id: runId,
    workflow_id: "wf-d-clasificar",
    started_at: started,
    finished_at: finished,
    status,
    country_id: countryId,
    n_ok: nOk,
    n_error: nErr,
    stats: { queue: snap.size, casos: touchedCasos.size },
  });

  const pending = await db
    .collection("raw_items")
    .where("country_id", "==", countryId)
    .where("clasificado", "==", false)
    .limit(500)
    .get();

  await db.collection("ops_summary").doc(countryId).set(
    {
      id: countryId,
      country_id: countryId,
      updated_at: finished,
      raw_queue_size: pending.size,
      last_wf_d: {
        id: runId,
        status,
        started_at: started,
        finished_at: finished,
        n_ok: nOk,
        n_error: nErr,
      },
    },
    { merge: true },
  );

  return NextResponse.json({
    ok: true,
    run_id: runId,
    n_ok: nOk,
    n_error: nErr,
    status,
    casos_touched: [...touchedCasos],
  });
}
