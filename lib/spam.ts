// ponytail: in-memory limiter is per-instance; swap for Redis/Upstash if running multiple instances.
const hits = new Map<string, number[]>();
export function limited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return arr.length > max;
}

export async function recaptchaOk(token?: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return true; // not configured: honeypot + timing + rate limit still apply
  if (!token) return false;
  const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
  });
  const j = (await r.json()) as { success?: boolean; score?: number };
  return !!j.success && (j.score ?? 0) >= 0.5;
}
