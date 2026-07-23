/**
 * Rate limit en memoria (por instancia). En serverless multi-instancia es
 * best-effort; combinar con WAF/Vercel si hace falta endurecer.
 */

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number };

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): RateLimitResult {
  const safeLimit = Math.max(1, limit);
  const safeWindow = Math.max(1000, windowMs);
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < safeWindow);
  if (bucket.timestamps.length >= safeLimit) {
    const oldest = bucket.timestamps[0]!;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((safeWindow - (now - oldest)) / 1000),
    );
    return { ok: false, retryAfterSec };
  }
  bucket.timestamps.push(now);
  return { ok: true, remaining: safeLimit - bucket.timestamps.length };
}

/** Solo tests. */
export function _resetRateLimitForTests() {
  buckets.clear();
}

export function ingestRateLimitConfig() {
  const perMin = Number(process.env.INGEST_RATE_LIMIT_PER_MIN || 60);
  return {
    limit: Number.isFinite(perMin) && perMin > 0 ? perMin : 60,
    windowMs: 60_000,
  };
}
