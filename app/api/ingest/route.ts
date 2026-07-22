import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";

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

/**
 * Ingesta desde n8n (u otros pipelines).
 * Header: x-ingest-secret: <INGEST_SECRET>
 * Body: { collection, id, data }
 */
export async function POST(req: NextRequest) {
  const secret = process.env.INGEST_SECRET || "escenarios-dev-ingest";
  const header = req.headers.get("x-ingest-secret");
  if (!header || header !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { collection?: string; id?: string; data?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { collection, id, data } = body;
  if (!collection || !id || !data || typeof data !== "object") {
    return NextResponse.json(
      { error: "need collection, id, data" },
      { status: 400 },
    );
  }
  if (!ALLOWED.has(collection)) {
    return NextResponse.json({ error: "collection not allowed" }, { status: 400 });
  }

  const workflowId = data.workflow_id;
  if (typeof workflowId !== "string" || !/^(wf-|seed-)/.test(workflowId)) {
    return NextResponse.json(
      { error: "data.workflow_id must start with wf- or seed-" },
      { status: 400 },
    );
  }

  try {
    await setDoc(doc(getDb(), collection, id), data, { merge: true });
    return NextResponse.json({ ok: true, collection, id });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
