import { describe, it, expect, beforeAll } from "bun:test";
import { app } from "../index.js";
import { db } from "../db/index.js";
import { realms } from "../db/schema.js";

const TEST_API_KEY = "demo-api-key-for-testing-only-do-not-use-in-production";
const AUTH_HEADER = `Bearer ${TEST_API_KEY}`;

function authRequest(path: string, options: RequestInit = {}) {
  return app.request(path, {
    ...options,
    headers: {
      ...((options.headers as Record<string, string>) || {}),
      Authorization: AUTH_HEADER,
    },
  });
}

describe("GET /v1/health", () => {
  it("returns status ok with DB connected (no auth required)", async () => {
    const res = await app.request("/v1/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.version).toBe("0.1.0");
    expect(body.db).toBe("connected");
    expect(typeof body.uptime).toBe("number");
  });
});

describe("POST /v1/calculate", () => {
  it("returns 401 without auth", async () => {
    const res = await app.request("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: 10,
        annualIncome: 35000,
        locationId: "berlin-de",
      }),
    });
    expect(res.status).toBe(401);
  });

  it("returns fair price for valid authenticated request", async () => {
    const res = await authRequest("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: 10,
        annualIncome: 35000,
        locationId: "berlin-de",
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.fairPrice).toBeGreaterThan(0);
    expect(body.breakdown.incomeFactor).toBe(0.85);
    expect(body.breakdown.locationFactor).toBe(1.05);
    expect(body.balanceStatus).toBeDefined();
  });

  it("returns 400 for negative price", async () => {
    const res = await authRequest("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: -5,
        annualIncome: 35000,
        locationId: "berlin-de",
      }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 for missing fields", async () => {
    const res = await authRequest("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ basePrice: 10 }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown location", async () => {
    const res = await authRequest("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: 10,
        annualIncome: 35000,
        locationId: "atlantis",
      }),
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("includes balanceStatus in response", async () => {
    const res = await authRequest("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: 100,
        annualIncome: 50000,
        locationId: "berlin-de",
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(["balanced", "recovering", "surplus"]).toContain(body.balanceStatus);
  });
});

describe("POST /v1/realms", () => {
  it("creates a realm and returns API key", async () => {
    const res = await app.request("/v1/realms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test Cafe" }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
    expect(body.name).toBe("Test Cafe");
    expect(body.apiKey).toBeDefined();
    expect(body.apiKey.length).toBeGreaterThanOrEqual(32);
  });

  it("returns 400 for missing name", async () => {
    const res = await app.request("/v1/realms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /v1/realms/:id", () => {
  it("returns realm details with valid auth", async () => {
    const res = await authRequest("/v1/realms/demo-cafe");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("demo-cafe");
    expect(body.name).toBe("Demo Cafe");
    expect(typeof body.balance).toBe("number");
    expect(typeof body.totalTransactions).toBe("number");
  });

  it("returns 401 without auth", async () => {
    const res = await app.request("/v1/realms/demo-cafe");
    expect(res.status).toBe(401);
  });
});

describe("GET /v1/realms/:id/balance", () => {
  it("returns balance summary", async () => {
    const res = await authRequest("/v1/realms/demo-cafe/balance");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.balance).toBe("number");
    expect(typeof body.totalTransactions).toBe("number");
    expect(typeof body.averageDelta).toBe("number");
  });

  it("returns 403 for wrong realm", async () => {
    const res = await authRequest("/v1/realms/other-realm/balance");
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error.code).toBe("FORBIDDEN");
  });
});

describe("Security", () => {
  it("includes security headers on every response", async () => {
    const res = await app.request("/v1/health");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains",
    );
  });

  it("returns 403 when accessing another realm's details", async () => {
    const res = await authRequest("/v1/realms/other-realm");
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error.code).toBe("FORBIDDEN");
  });

  it("returns plain API key only on realm creation", async () => {
    const res = await app.request("/v1/realms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Key Test Cafe" }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    // Key should be 64-char hex (plain), not a SHA-256 hash of that
    expect(body.apiKey).toMatch(/^[0-9a-f]{64}$/);
    // Verify the key works for auth
    const authRes = await app.request(`/v1/realms/${body.id}`, {
      headers: { Authorization: `Bearer ${body.apiKey}` },
    });
    expect(authRes.status).toBe(200);
  });
});

describe("Middleware", () => {
  it("includes X-Request-Id header on every response", async () => {
    const res = await app.request("/v1/health");
    const requestId = res.headers.get("X-Request-Id");
    expect(requestId).toBeTruthy();
    expect(requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("generates unique request IDs per request", async () => {
    const res1 = await app.request("/v1/health");
    const res2 = await app.request("/v1/health");
    expect(res1.headers.get("X-Request-Id")).not.toBe(
      res2.headers.get("X-Request-Id"),
    );
  });

  it("includes CORS headers", async () => {
    const res = await app.request("/v1/health", {
      headers: { Origin: "https://example.com" },
    });
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
  });
});

describe("GET /v1/doc", () => {
  it("returns OpenAPI spec", async () => {
    const res = await app.request("/v1/doc");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.openapi).toBe("3.1.0");
    expect(body.info.title).toBe("Fairtide API");
  });
});

describe("GET /v1/docs", () => {
  it("returns Swagger UI HTML", async () => {
    const res = await app.request("/v1/docs");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("swagger-ui");
  });
});

describe("Revenue-neutral balancing", () => {
  it("dampens income factor when realm balance is negative", async () => {
    // Set demo realm balance to -30 (recovering)
    db.update(realms)
      .set({ balance: -30, dampingThreshold: -50 })
      .where(require("drizzle-orm").eq(realms.id, "demo-cafe"))
      .run();

    const res = await authRequest("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: 100,
        annualIncome: 15000,
        locationId: "berlin-de",
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();

    // Standard factor for 15k income is 0.7
    // With balance -30, threshold -50: D = 1 - (-30 / -50) = 0.4
    // Adjusted = 1.0 + (0.7 - 1.0) * 0.4 = 1.0 - 0.12 = 0.88
    expect(body.breakdown.incomeFactor).toBe(0.7);
    expect(body.breakdown.adjustedIncomeFactor).toBeGreaterThan(0.7);
    expect(body.breakdown.adjustedIncomeFactor).toBeLessThan(1.0);
    expect(body.balanceStatus).toBe("recovering");

    // Reset balance for other tests
    db.update(realms)
      .set({ balance: 0, totalTransactions: 0 })
      .where(require("drizzle-orm").eq(realms.id, "demo-cafe"))
      .run();
  });
});
