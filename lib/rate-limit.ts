import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

let _redis: Redis | null = null;

function redis(): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (!_redis) {
    _redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

export const limiters = {
  auth: () => {
    const r = redis();
    return r ? new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(5, "1 m"), prefix: "rl:auth" }) : null;
  },
  newsletter: () => {
    const r = redis();
    return r ? new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(3, "10 m"), prefix: "rl:nl" }) : null;
  },
  contact: () => {
    const r = redis();
    return r ? new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(3, "10 m"), prefix: "rl:contact" }) : null;
  },
};

export async function consume(
  limiterKey: keyof typeof limiters,
  identifier: string,
): Promise<{ success: boolean; remaining: number }> {
  const factory = limiters[limiterKey];
  const limiter = factory();
  if (!limiter) return { success: true, remaining: Number.POSITIVE_INFINITY };
  const result = await limiter.limit(identifier);
  return { success: result.success, remaining: result.remaining };
}
