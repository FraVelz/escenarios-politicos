import { NextRequest, NextResponse } from "next/server";
import { clientKey, requireIngestSecret } from "@/lib/ingest-auth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  checkRateLimit,
  ingestRateLimitConfig,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 40;
const MAX_LIMIT = 100;

/**
 * Cola de raw_items no clasificados para WF-D.
 * Header: x-ingest-secret
 * Query: country_id (default co), limit (default 40)
 */
export async function GET(req: NextRequest) {
  const authErr = requireIngestSecret(req);
  if (authErr) return authErr;

  const { limit: rlLimit, windowMs } = ingestRateLimitConfig();
  const rl = checkRateLimit(`raw-queue:${clientKey(req)}`, rlLimit, windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded", retry_after_sec: rl.retryAfterSec },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      },
    );
  }

  const sp = req.nextUrl.searchParams;
  const countryId = sp.get("country_id") || "co";
  const limitRaw = Number(sp.get("limit") || DEFAULT_LIMIT);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.isFinite(limitRaw) ? limitRaw : DEFAULT_LIMIT),
  );

  try {
    const db = getAdminDb();
    const snap = await db
      .collection("raw_items")
      .where("country_id", "==", countryId)
      .where("clasificado", "==", false)
      .limit(limit)
      .get();

    const items = snap.docs.map((d) => {
      const data = d.data();
      return { id: d.id, ...data };
    });

    return NextResponse.json({
      ok: true,
      country_id: countryId,
      count: items.length,
      items,
    });
  } catch (e) {
    console.error("raw-queue failed", e);
    return NextResponse.json({ error: "query failed" }, { status: 500 });
  }
}
