import { NextRequest, NextResponse } from "next/server";
import { clientKey, requireIngestSecret } from "@/lib/ingest-auth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  checkRateLimit,
  ingestRateLimitConfig,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Agregados operativos para /gaps y n8n (auth por secreto).
 * Query: country_id=co
 */
export async function GET(req: NextRequest) {
  const authErr = requireIngestSecret(req);
  if (authErr) return authErr;

  const { limit, windowMs } = ingestRateLimitConfig();
  const rl = checkRateLimit(`ingest-status:${clientKey(req)}`, limit, windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded", retry_after_sec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const countryId = req.nextUrl.searchParams.get("country_id") || "co";

  try {
    const db = getAdminDb();
    const [rawPend, errors, runs] = await Promise.all([
      db
        .collection("raw_items")
        .where("country_id", "==", countryId)
        .where("clasificado", "==", false)
        .limit(500)
        .get(),
      db
        .collection("ingest_errors")
        .where("country_id", "==", countryId)
        .limit(50)
        .get(),
      db.collection("ingest_runs").limit(30).get(),
    ]);

    const runsFiltered = runs.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter(
        (r) =>
          !("country_id" in r) ||
          r.country_id === countryId ||
          r.country_id == null,
      )
      .sort((a, b) => {
        const sa = String((a as { started_at?: string }).started_at || "");
        const sb = String((b as { started_at?: string }).started_at || "");
        return sb.localeCompare(sa);
      })
      .slice(0, 15);

    const lastByWf = new Map<string, (typeof runsFiltered)[0]>();
    for (const r of runsFiltered) {
      const wf = String((r as { workflow_id?: string }).workflow_id || "");
      if (wf && !lastByWf.has(wf)) lastByWf.set(wf, r);
    }

    return NextResponse.json({
      ok: true,
      country_id: countryId,
      raw_queue_size: rawPend.size,
      ingest_errors_recent: errors.size,
      last_runs_by_workflow: Object.fromEntries(lastByWf),
      recent_runs: runsFiltered,
    });
  } catch (e) {
    console.error("ingest-status failed", e);
    return NextResponse.json({ error: "query failed" }, { status: 500 });
  }
}
