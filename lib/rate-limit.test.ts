import { describe, expect, it, beforeEach } from "vitest";
import {
  _resetRateLimitForTests,
  checkRateLimit,
} from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => _resetRateLimitForTests());

  it("permite hasta el límite y luego bloquea", () => {
    const key = "t1";
    expect(checkRateLimit(key, 2, 60_000, 1000).ok).toBe(true);
    expect(checkRateLimit(key, 2, 60_000, 1001).ok).toBe(true);
    const blocked = checkRateLimit(key, 2, 60_000, 1002);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("libera tras la ventana", () => {
    const key = "t2";
    checkRateLimit(key, 1, 1000, 0);
    expect(checkRateLimit(key, 1, 1000, 500).ok).toBe(false);
    expect(checkRateLimit(key, 1, 1000, 1001).ok).toBe(true);
  });
});
