import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/app.js";
import { sqlite } from "../db/index.js";

const healthResponseSchema = z.object({
  status: z.string().openapi({ example: "ok" }),
  version: z.string().openapi({ example: "0.1.0" }),
  uptime: z.number().openapi({ example: 123.45 }),
  db: z.string().openapi({ example: "connected" }),
});

const route = createRoute({
  method: "get",
  path: "/health",
  responses: {
    200: {
      content: { "application/json": { schema: healthResponseSchema } },
      description: "API health status",
    },
  },
});

const startTime = Date.now();

export const healthRoute = createRouter().openapi(route, (c) => {
  let dbStatus = "connected";
  try {
    sqlite.query("SELECT 1").get();
  } catch {
    dbStatus = "error";
  }

  const status = dbStatus === "connected" ? "ok" : "degraded";
  return c.json(
    {
      status,
      version: "0.1.0",
      uptime: (Date.now() - startTime) / 1000,
      db: dbStatus,
    },
    200,
  );
});
