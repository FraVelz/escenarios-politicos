import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "casos",
  "menciones",
  "indicadores",
  "raw_items",
  "eventos",
  "alertas",
  "ingest_errors",
  "ingest_runs",
]);

const MAX_BODY_BYTES = 256_000;
const MAX_ID_LEN = 128;
const ID_RE = /^[a-zA-Z0-9_.:\-]+$/;

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

  let body: { collection?: string; id?: string; data?: Record<string, unknown> };
  try {
    body = JSON.parse(rawText) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { collection, id, data } = body;
  if (!collection || !id || !data || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json(
      { error: "need collection, id, data object" },
      { status: 400 },
    );
  }
  if (!ALLOWED.has(collection)) {
    return NextResponse.json({ error: "collection not allowed" }, { status: 400 });
  }
  if (typeof id !== "string" || id.length > MAX_ID_LEN || !ID_RE.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const workflowId = data.workflow_id;
  if (typeof workflowId !== "string" || !/^(wf-|seed-)/.test(workflowId)) {
    return NextResponse.json(
      { error: "data.workflow_id must start with wf- or seed-" },
      { status: 400 },
    );
  }

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
