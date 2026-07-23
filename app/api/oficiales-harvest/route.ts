import { NextRequest, NextResponse } from "next/server";
import { clientKey, requireIngestSecret } from "@/lib/ingest-auth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { listFuentesRegistro } from "@/lib/fuentes-registro";
import { parseFeedItems } from "@/lib/rss-parse";
import { matchCasoCatalog } from "@/lib/casos-catalog";
import {
  checkRateLimit,
  ingestRateLimitConfig,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Cosecha feeds oficiales/datos con RSS → eventos.
 * Header: x-ingest-secret
 */
export async function POST(req: NextRequest) {
  const authErr = requireIngestSecret(req);
  if (authErr) return authErr;

  const { limit, windowMs } = ingestRateLimitConfig();
  const rl = checkRateLimit(`oficiales:${clientKey(req)}`, limit, windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded", retry_after_sec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const countryId = req.nextUrl.searchParams.get("country_id") || "co";
  const oficiales = listFuentesRegistro(countryId).filter(
    (f) =>
      (f.clase === "oficial" || f.clase === "datos") &&
      typeof f.rss_url === "string" &&
      f.rss_url.length > 0,
  );

  const runId = `run-wf-b-${Date.now()}`;
  const started = new Date().toISOString();
  const db = getAdminDb();
  let nOk = 0;
  let nErr = 0;

  if (oficiales.length === 0) {
    const errId = `err-wf-b-no-feeds-${Date.now()}`;
    await db.collection("ingest_errors").doc(errId).set({
      id: errId,
      country_id: countryId,
      workflow_id: "wf-b-oficiales",
      reason: "no_official_rss_configured",
      created_at: new Date().toISOString(),
      payload: {
        titulo: "Agregar rss_url a fuentes oficiales en fuentes_registro.json",
        url: null,
        fecha: null,
      },
    });
    nErr = 1;
  }

  for (const feed of oficiales) {
    try {
      const res = await fetch(feed.rss_url!, {
        headers: { "User-Agent": "escenarios-politicos-oficiales/1.0" },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) {
        nErr += 1;
        const errId = `err-wf-b-${feed.id}-${Date.now()}`;
        await db.collection("ingest_errors").doc(errId).set({
          id: errId,
          country_id: countryId,
          workflow_id: "wf-b-oficiales",
          reason: `rss_http_${res.status}`,
          created_at: new Date().toISOString(),
          payload: { titulo: feed.nombre, url: feed.rss_url!, fecha: null },
        });
        continue;
      }
      const items = parseFeedItems(await res.text()).slice(0, 15);
      for (const it of items) {
        if (!it.link) {
          nErr += 1;
          continue;
        }
        const hit = matchCasoCatalog(`${it.title} ${it.summary}`);
        const id = `evt-${Buffer.from(it.link).toString("base64url").slice(0, 36)}`;
        await db.collection("eventos").doc(id).set(
          {
            id,
            country_id: countryId,
            workflow_id: "wf-b-oficiales",
            titulo: it.title || "N/D",
            fecha: it.date || "N/D",
            url: it.link,
            fuente: feed.clase === "datos" ? "datos" : "oficial",
            ingerido_en: new Date().toISOString(),
            resumen: it.summary.slice(0, 1000),
            caso_ids: hit ? [hit.id] : [],
          },
          { merge: true },
        );
        nOk += 1;
      }
    } catch (e) {
      nErr += 1;
      const errId = `err-wf-b-${feed.id}-ex-${Date.now()}`;
      await db.collection("ingest_errors").doc(errId).set({
        id: errId,
        country_id: countryId,
        workflow_id: "wf-b-oficiales",
        reason: e instanceof Error ? e.message.slice(0, 200) : "fetch_error",
        created_at: new Date().toISOString(),
        payload: { titulo: feed.nombre, url: feed.rss_url || null, fecha: null },
      });
    }
  }

  const finished = new Date().toISOString();
  const status = nErr && nOk ? "partial" : nErr && !nOk ? "error" : "ok";
  await db.collection("ingest_runs").doc(runId).set({
    id: runId,
    workflow_id: "wf-b-oficiales",
    started_at: started,
    finished_at: finished,
    status,
    country_id: countryId,
    n_ok: nOk,
    n_error: nErr,
    stats: { feeds: oficiales.length },
  });

  await db.collection("ops_summary").doc(countryId).set(
    {
      id: countryId,
      country_id: countryId,
      updated_at: finished,
      last_wf_b: {
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
    feeds: oficiales.map((f) => f.id),
  });
}
