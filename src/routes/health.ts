import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/app.js";

const healthResponseSchema = z.object({
  status: z.string().openapi({ example: "ok" }),
  version: z.string().openapi({ example: "0.1.0" }),
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

export const healthRoute = createRouter().openapi(route, (c) => {
  return c.json({ status: "ok", version: "0.1.0" }, 200);
});
