import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  MAX_BODY_BYTES,
  ingestBodySchema,
} from "@/lib/ingest-schema";

export const runtime = "nodejs";

function secretsEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/**
 * Ingesta desde n8n (u otros pipelines).
 * Header: x-ingest-secret: <INGEST_SECRET>
 * Body: { collection, id, data }
 *
 * Escritura con Admin SDK — las rules de cliente deniegan write.
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

  // Evitar que el payload cambie el id del documento.
  const payload = { ...data, id };

  try {
    await getAdminDb().collection(collection).doc(id).set(payload, { merge: true });
    return NextResponse.json({ ok: true, collection, id });
  } catch (e) {
    console.error("ingest write failed", e);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}
