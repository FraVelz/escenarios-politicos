import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { clientKey, requireIngestSecret } from "@/lib/ingest-auth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { listRssFeeds } from "@/lib/fuentes-registro";
import { parseFeedItems } from "@/lib/rss-parse";
import {
  checkRateLimit,
  ingestRateLimitConfig,
} from "@/lib/rate-limit";

function rawIdFromUrl(url: string): string {
  return `raw-${createHash("sha256").update(url).digest("base64url").slice(0, 32)}`;
}

export const runtime = "nodejs";

const TITLE_BLACKLIST = [
  /^(portada|últimas noticias|ultimas noticias|en vivo|opinión|opinion)$/i,
];

/**
 * Cosecha multi-RSS (registro de fuentes) → raw_items + ingest_runs.
 * Header: x-ingest-secret
 */
export async function POST(req: NextRequest) {
  const authErr = requireIngestSecret(req);
  if (authErr) return authErr;

  const { limit, windowMs } = ingestRateLimitConfig();
  const rl = checkRateLimit(`rss-harvest:${clientKey(req)}`, limit, windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded", retry_after_sec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const countryId = req.nextUrl.searchParams.get("country_id") || "co";
  const feeds = listRssFeeds(countryId).slice(0, 4);
  const runId = `run-wf-c-${Date.now()}`;
  const started = new Date().toISOString();
  const db = getAdminDb();

  let nOk = 0;
  let nErr = 0;
  const seen = new Set<string>();
  const errors: string[] = [];

  await db.collection("ingest_runs").doc(runId).set(
    {
      id: runId,
      workflow_id: "wf-c-rss",
      started_at: started,
      status: "partial",
      country_id: countryId,
      n_ok: 0,
      n_error: 0,
    },
    { merge: true },
  );

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.rss_url, {
        headers: { "User-Agent": "escenarios-politicos-rss/1.0" },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) {
        nErr += 1;
        errors.push(`${feed.fuente_id}: HTTP ${res.status}`);
        const errId = `err-rss-${feed.fuente_id}-${Date.now()}`;
        await db.collection("ingest_errors").doc(errId).set({
          id: errId,
          country_id: countryId,
          workflow_id: "wf-c-rss",
          reason: `rss_http_${res.status}`,
          created_at: new Date().toISOString(),
          payload: { titulo: feed.nombre, url: feed.rss_url },
        });
        continue;
      }
      const xml = await res.text();
      const items = parseFeedItems(xml).slice(0, 12);
      for (const it of items) {
        const url = it.link;
        const titulo = it.title.trim();
        if (!url) {
          nErr += 1;
          continue;
        }
        if (
          titulo.length < 12 ||
          TITLE_BLACKLIST.some((re) => re.test(titulo))
        ) {
          nErr += 1;
          continue;
        }
        if (seen.has(url)) continue;
        seen.add(url);
        const id = rawIdFromUrl(url);
        await db.collection("raw_items").doc(id).set(
          {
            id,
            country_id: countryId,
            url,
            titulo: titulo || "N/D",
            resumen: it.summary.slice(0, 2000),
            fecha: it.date || "N/D",
            fuente: "medio",
            fuente_id: feed.fuente_id,
            linea: feed.linea,
            ingerido_en: new Date().toISOString(),
            workflow_id: "wf-c-rss",
            clasificado: false,
            estado_cola: "pendiente",
          },
          { merge: true },
        );
        nOk += 1;
        if (nOk >= 30) break;
      }
    } catch (e) {
      nErr += 1;
      errors.push(
        `${feed.fuente_id}: ${e instanceof Error ? e.message : "fetch"}`,
      );
    }
    if (nOk >= 30) break;
  }

  const status = nErr && nOk ? "partial" : nErr && !nOk ? "error" : "ok";
  const finished = new Date().toISOString();
  await db.collection("ingest_runs").doc(runId).set(
    {
      id: runId,
      workflow_id: "wf-c-rss",
      started_at: started,
      finished_at: finished,
      status,
      country_id: countryId,
      n_ok: nOk,
      n_error: nErr,
      stats: { feeds: feeds.length, deduped: seen.size, errors },
    },
    { merge: true },
  );

  await db.collection("ops_summary").doc(countryId).set(
    {
      id: countryId,
      country_id: countryId,
      updated_at: finished,
      last_wf_c: {
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
    feeds: feeds.map((f) => f.fuente_id),
  });
}
