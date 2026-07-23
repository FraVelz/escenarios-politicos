import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export function secretsEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function clientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/** Valida x-ingest-secret. null = OK; NextResponse = error. */
export function requireIngestSecret(req: NextRequest): NextResponse | null {
  const secret = process.env.INGEST_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "server misconfigured" }, { status: 503 });
  }
  const header = req.headers.get("x-ingest-secret") ?? "";
  if (!header || !secretsEqual(header, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
