import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/app.js";
import { createRealm, getRealm } from "../services/realm.js";
import { getBalance } from "../services/balance.js";
import { auth } from "../middleware/auth.js";

const realmRouter = createRouter();

// POST /realms - Create a new realm (no auth required)
const createRealmRoute = createRoute({
  method: "post",
  path: "/realms",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().min(1).max(100).openapi({ example: "Cafe Bar" }),
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.string().openapi({ example: "abc-123" }),
            name: z.string().openapi({ example: "Cafe Bar" }),
            apiKey: z.string().openapi({ example: "a1b2c3..." }),
          }),
        },
      },
      description: "Realm created",
    },
  },
});

realmRouter.openapi(createRealmRoute, async (c) => {
  const { name } = c.req.valid("json");
  const realm = await createRealm(name);
  return c.json(realm, 201);
});

// GET /realms/:id - Get realm details (auth required)
const getRealmRoute = createRoute({
  method: "get",
  path: "/realms/{id}",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
            totalTransactions: z.number(),
            createdAt: z.string(),
          }),
        },
      },
      description: "Realm details",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.object({ code: z.string(), message: z.string() }),
          }),
        },
      },
      description: "Unauthorized",
    },
    403: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.object({ code: z.string(), message: z.string() }),
          }),
        },
      },
      description: "Forbidden — cannot access another realm",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.object({ code: z.string(), message: z.string() }),
          }),
        },
      },
      description: "Realm not found",
    },
  },
  middleware: [auth] as const,
});

realmRouter.openapi(getRealmRoute, async (c) => {
  const { id } = c.req.valid("param");
  const authRealm = c.get("realm");
  if (authRealm.id !== id) {
    return c.json(
      { error: { code: "FORBIDDEN", message: "Access denied to this realm" } },
      403,
    );
  }

  const realm = await getRealm(id);
  if (!realm) {
    return c.json(
      { error: { code: "NOT_FOUND", message: "Realm not found" } },
      404,
    );
  }

  return c.json(
    {
      id: realm.id,
      name: realm.name,
      balance: Math.round(realm.balance * 100) / 100,
      totalTransactions: realm.totalTransactions,
      createdAt: realm.createdAt,
    },
    200,
  );
});

// GET /realms/:id/balance - Get balance details (auth required)
const getBalanceRoute = createRoute({
  method: "get",
  path: "/realms/{id}/balance",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            balance: z.number(),
            totalTransactions: z.number(),
            averageDelta: z.number(),
          }),
        },
      },
      description: "Balance details",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.object({ code: z.string(), message: z.string() }),
          }),
        },
      },
      description: "Unauthorized",
    },
    403: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.object({ code: z.string(), message: z.string() }),
          }),
        },
      },
      description: "Forbidden — cannot access another realm",
    },
  },
  middleware: [auth] as const,
});

realmRouter.openapi(getBalanceRoute, async (c) => {
  const { id } = c.req.valid("param");
  const authRealm = c.get("realm");
  if (authRealm.id !== id) {
    return c.json(
      { error: { code: "FORBIDDEN", message: "Access denied to this realm" } },
      403,
    );
  }

  const balance = getBalance(id);
  return c.json(balance, 200);
});

export { realmRouter };
