import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { consolidarCasoFromMenciones } from "@/lib/consolidar-caso";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { validateDomainPayload } from "@/lib/ingest-domain";
import {
  MAX_BODY_BYTES,
  ingestBodySchema,
} from "@/lib/ingest-schema";
import {
  checkRateLimit,
  ingestRateLimitConfig,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

function secretsEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function clientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

async function consolidarCasoAfterMencion(casoId: string) {
  const db = getAdminDb();
  const casoRef = db.collection("casos").doc(casoId);
  const casoSnap = await casoRef.get();
  if (!casoSnap.exists) return { consolidated: false as const, reason: "caso_missing" };

  const mencionesSnap = await db
    .collection("menciones")
    .where("caso_id", "==", casoId)
    .get();
  const menciones = mencionesSnap.docs.map((d) => d.data());
  const patch = consolidarCasoFromMenciones(casoSnap.data() || {}, menciones);
  await casoRef.set(patch, { merge: true });
  return {
    consolidated: true as const,
    n_menciones: patch.n_menciones,
    credibilidad: patch.credibilidad,
  };
}

/**
 * Ingesta desde n8n (u otros pipelines).
 * Header: x-ingest-secret: <INGEST_SECRET>
 * Body: { collection, id, data }
 *
 * Tras escribir una mención, consolida n_menciones/credibilidad del caso.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.INGEST_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "server misconfigured" },
      { status: 503 },
    );
  }

  const header = req.headers.get("x-ingest-secret") ?? "";
  if (!header || !secretsEqual(header, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { limit, windowMs } = ingestRateLimitConfig();
  const rl = checkRateLimit(`ingest:${clientKey(req)}`, limit, windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded", retry_after_sec: rl.retryAfterSec },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      },
    );
  }

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }

  let rawText: string;
  try {
    rawText = await req.text();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (rawText.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = ingestBodySchema.safeParse(json);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "invalid payload" },
      { status: 400 },
    );
  }

  const { collection, id, data } = parsed.data;
  const payload = { ...data, id };

  const domain = validateDomainPayload(collection, payload);
  if (!domain.ok) {
    return NextResponse.json({ error: domain.message }, { status: 400 });
  }

  try {
    await getAdminDb()
      .collection(collection)
      .doc(id)
      .set(domain.data, { merge: true });

    let consolidation:
      | Awaited<ReturnType<typeof consolidarCasoAfterMencion>>
      | undefined;
    if (collection === "menciones") {
      const casoId = domain.data.caso_id;
      if (typeof casoId === "string" && casoId.length > 0) {
        consolidation = await consolidarCasoAfterMencion(casoId);
      }
    }

    return NextResponse.json({
      ok: true,
      collection,
      id,
      consolidation,
    });
  } catch (e) {
    console.error("ingest write failed", e);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}
