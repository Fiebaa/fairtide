import { createMiddleware } from "hono/factory";
import { config } from "../config/env.js";

const store = new Map<string, { count: number; resetAt: number }>();

function getClientIp(c: { req: { header: (name: string) => string | undefined } }): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown"
  );
}

export const rateLimit = createMiddleware(async (c, next) => {
  const ip = getClientIp(c);
  const now = Date.now();
  const entry = store.get(ip);

  if (entry && entry.resetAt > now) {
    if (entry.count >= config.rateLimit.max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      c.header("Retry-After", String(retryAfter));
      return c.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please try again later.",
          },
        },
        429,
      );
    }
    entry.count++;
  } else {
    store.set(ip, { count: 1, resetAt: now + config.rateLimit.windowMs });
  }

  // Cleanup old entries periodically
  if (store.size > 10_000) {
    for (const [key, val] of store) {
      if (val.resetAt <= now) store.delete(key);
    }
  }

  await next();
});
