export const config = {
  port: Number(process.env.PORT) || 3000,
  dbPath: process.env.DB_PATH || "./data/fairify.db",
  logLevel: (process.env.LOG_LEVEL || "info") as
    | "debug"
    | "info"
    | "warn"
    | "error",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  },
} as const;
