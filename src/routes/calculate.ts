import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/app.js";
import { calculateFairPrice } from "../services/pricing.js";
import { recordTransaction } from "../services/balance.js";
import { auth } from "../middleware/auth.js";

const calculateRequestSchema = z.object({
  basePrice: z.number().positive().openapi({ example: 10.0 }),
  annualIncome: z.number().positive().openapi({ example: 35000 }),
  countryCode: z.string().length(2).toUpperCase().openapi({ example: "DE" }),
});

const breakdownSchema = z.object({
  basePrice: z.number().openapi({ example: 10.0 }),
  pppAdjustedIncome: z.number().openapi({ example: 35000 }),
  buyerPppFactor: z.number().openapi({ example: 0.95 }),
  sellerPppFactor: z.number().openapi({ example: 0.95 }),
  incomeFactor: z.number().openapi({ example: 0.85 }),
  adjustedIncomeFactor: z.number().optional().openapi({ example: 0.92 }),
  fairPrice: z.number().openapi({ example: 8.5 }),
});

const calculateResponseSchema = z.object({
  fairPrice: z.number().openapi({ example: 8.5 }),
  breakdown: breakdownSchema,
  balanceStatus: z
    .enum(["balanced", "recovering", "surplus"])
    .optional()
    .openapi({ example: "balanced" }),
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
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Country code not found",
    },
  },
  middleware: [auth] as const,
});

export const calculateRoute = createRouter().openapi(route, async (c) => {
  const { basePrice, annualIncome, countryCode } = c.req.valid("json");
  const realm = c.get("realm");

  const result = calculateFairPrice(
    basePrice,
    annualIncome,
    countryCode,
    realm,
  );

  // Record the transaction for balance tracking
  recordTransaction(realm.id, basePrice, result.fairPrice);

  return c.json(result, 200);
});
