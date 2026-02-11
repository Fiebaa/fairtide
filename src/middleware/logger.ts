import { createMiddleware } from "hono/factory";
import { config } from "../config/env.js";

const levels = { debug: 0, info: 1, warn: 2, error: 3 } as const;

function shouldLog(level: keyof typeof levels): boolean {
  return levels[level] >= levels[config.logLevel];
}

export const logger = createMiddleware(async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  if (shouldLog("info")) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: c.res.status >= 500 ? "error" : c.res.status >= 400 ? "warn" : "info",
      requestId: c.get("requestId") || "-",
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration,
    };
    console.log(JSON.stringify(entry));
  }
});
