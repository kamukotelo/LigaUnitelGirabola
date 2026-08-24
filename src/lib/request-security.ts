import 'server-only';
import { createHash, timingSafeEqual } from 'node:crypto';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfter: number;
}

const buckets = new Map<string, RateLimitEntry>();
const MAX_BUCKETS = 10_000;

function requestIdentity(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const address = request.headers.get('x-real-ip')?.trim() || forwarded || 'unknown';
  return createHash('sha256').update(address).digest('hex').slice(0, 24);
}

/**
 * Limite local a cada instância. Deve ser complementado pelo WAF/rate limit
 * da hospedagem para obter um contador distribuído em produção.
 */
export function checkRateLimit(
  request: Request,
  namespace: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const key = `${namespace}:${requestIdentity(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  if (buckets.size > MAX_BUCKETS) {
    for (const [candidate, entry] of buckets) {
      if (entry.resetAt <= now) buckets.delete(candidate);
    }
  }
  return { allowed: true, retryAfter: 0 };
}

/** Bloqueia pedidos de browser enviados por outra origem (proteção CSRF). */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  const allowed = new Set<string>();
  try { allowed.add(new URL(request.url).origin); } catch { return false; }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try { allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin); } catch { /* configuração inválida */ }
  }
  return allowed.has(origin);
}

export function safeSecretEqual(candidate: unknown, expected: string | undefined): boolean {
  if (typeof candidate !== 'string' || !candidate || !expected) return false;
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return candidateBuffer.length === expectedBuffer.length
    && timingSafeEqual(candidateBuffer, expectedBuffer);
}
