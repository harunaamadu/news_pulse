import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

type Window = `${number} ${"s" | "m" | "h"}`;

const policies = {
  "sign-in": { requests: 5, window: "1 m" },
  "sign-up": { requests: 5, window: "10 m" },
  comment: { requests: 10, window: "1 m" },
  search: { requests: 30, window: "1 m" },
  browse: { requests: 60, window: "1 m" },
  contact: { requests: 3, window: "10 m" },
} satisfies Record<string, { requests: number; window: Window }>;

export type RateLimitName = keyof typeof policies;

// No keys (local dev) means no limiting
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const limiters = new Map<RateLimitName, Ratelimit>();

function getLimiter(name: RateLimitName): Ratelimit | null {
  if (!redis) return null;

  let limiter = limiters.get(name);
  if (!limiter) {
    const { requests, window } = policies[name];
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, window),
      prefix: `newspulse:rl:${name}`,
    });
    limiters.set(name, limiter);
  }
  return limiter;
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

export async function checkRateLimit(
  name: RateLimitName,
  identifier: string,
): Promise<RateLimitResult> {
  const limiter = getLimiter(name);
  if (!limiter) return { ok: true };

  try {
    const { success, reset } = await limiter.limit(identifier);
    if (success) return { ok: true };

    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    };
  } catch (error) {
    // Fail open: a Redis outage must not take the site down
    console.error("Rate limiter unavailable", error);
    return { ok: true };
  }
}

// Behind a trusted proxy (Vercel, Cloudflare) x-forwarded-for is set by the platform
export async function getClientIp(): Promise<string> {
  const requestHeaders = await headers();

  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimitMessage(retryAfter: number): string {
  if (retryAfter < 60) {
    return `Too many requests. Please try again in ${retryAfter} seconds.`;
  }
  const minutes = Math.ceil(retryAfter / 60);
  return `Too many requests. Please try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`;
}
