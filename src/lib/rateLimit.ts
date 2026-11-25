/** Limiteur de débit en mémoire (MODE DÉMO / mono-instance).
 *  En production, remplacer par Redis / Upstash pour les déploiements multi-nodes. */

const buckets = new Map<string, number[]>();

export interface RateResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export function hitRateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  const raw = buckets.get(key) ?? [];
  const window = raw.filter((t) => now - t < windowMs);
  window.push(now);
  buckets.set(key, window);
  const allowed = window.length <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - window.length),
    resetMs: window.length ? window[0] + windowMs - now : 0,
  };
}

export function rateHeaders(result: RateResult, limit: number) {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'Retry-After': String(Math.ceil(result.resetMs / 1000)),
  };
}
