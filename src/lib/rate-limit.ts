type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(opts: { key: string; max: number; windowMs: number }): { ok: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const bucket = buckets.get(opts.key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(opts.key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.max - 1, resetMs: opts.windowMs };
  }
  bucket.count += 1;
  if (bucket.count > opts.max) {
    return { ok: false, remaining: 0, resetMs: bucket.resetAt - now };
  }
  return { ok: true, remaining: opts.max - bucket.count, resetMs: bucket.resetAt - now };
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
