import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/app.js";
import { calculateFairPrice } from "../services/pricing.js";

const calculateRequestSchema = z.object({
  basePrice: z.number().positive().openapi({ example: 10.0 }),
  annualIncome: z.number().positive().openapi({ example: 35000 }),
  locationId: z.string().min(1).openapi({ example: "berlin-de" }),
});

const breakdownSchema = z.object({
  basePrice: z.number().openapi({ example: 10.0 }),
  incomeFactor: z.number().openapi({ example: 0.85 }),
  locationFactor: z.number().openapi({ example: 1.05 }),
  fairPrice: z.number().openapi({ example: 8.93 }),
});

const calculateResponseSchema = z.object({
  fairPrice: z.number().openapi({ example: 8.93 }),
  breakdown: breakdownSchema,
});

const errorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(z.string()).optional(),
  }),
});

const route = createRoute({
  method: "post",
  path: "/calculate",
  request: {
    body: {
      content: { "application/json": { schema: calculateRequestSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: calculateResponseSchema } },
      description: "Fair price calculation result",
    },
    400: {
      content: { "application/json": { schema: errorSchema } },
      description: "Validation error",
    },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Location not found",
    },
  },
});

export const calculateRoute = createRouter().openapi(route, async (c) => {
  const { basePrice, annualIncome, locationId } = c.req.valid("json");
  const result = await calculateFairPrice(basePrice, annualIncome, locationId);
  return c.json(result, 200);
});
