/**
 * In-memory rate limiter. Per-process only — not safe across
 * serverless instances. Upgrade path: install @upstash/ratelimit
 * + @upstash/redis and replace the body of `limit()` with an
 * Upstash sliding-window limiter. Until then this is best-effort.
 */

type Bucket = { count: number; resetAt: number };

const store: Map<string, Bucket> =
  (globalThis as any).__rateLimitStore__ ?? new Map();
(globalThis as any).__rateLimitStore__ = store;

export interface RateLimitOptions {
  /** unique key (e.g. `otp:${phone}` or `email:${userId}`) */
  key: string;
  /** max requests within the window */
  limit: number;
  /** window length in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit({
  key,
  limit,
  windowMs
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    const bucket = { count: 1, resetAt: now + windowMs };
    store.set(key, bucket);
    return { success: true, remaining: limit - 1, resetAt: bucket.resetAt };
  }
  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }
  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt
  };
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
