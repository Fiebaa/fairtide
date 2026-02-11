import { describe, it, expect } from "bun:test";
import { app } from "../index.js";

describe("GET /v1/health", () => {
  it("returns status ok", async () => {
    const res = await app.request("/v1/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: "ok", version: "0.1.0" });
  });
});

describe("POST /v1/calculate", () => {
  it("returns fair price for valid request", async () => {
    const res = await app.request("/v1/calculate", {
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
    expect(body.fairPrice).toBe(8.93);
    expect(body.breakdown.incomeFactor).toBe(0.85);
    expect(body.breakdown.locationFactor).toBe(1.05);
  });

  it("returns 400 for negative price", async () => {
    const res = await app.request("/v1/calculate", {
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
    const res = await app.request("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ basePrice: 10 }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown location", async () => {
    const res = await app.request("/v1/calculate", {
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

  it("handles various income brackets correctly", async () => {
    const low = await app.request("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: 100,
        annualIncome: 15000,
        locationId: "berlin-de",
      }),
    });
    const lowBody = await low.json();
    expect(lowBody.breakdown.incomeFactor).toBe(0.7);

    const high = await app.request("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: 100,
        annualIncome: 150000,
        locationId: "berlin-de",
      }),
    });
    const highBody = await high.json();
    expect(highBody.breakdown.incomeFactor).toBe(1.2);
  });
});

describe("GET /v1/doc", () => {
  it("returns OpenAPI spec", async () => {
    const res = await app.request("/v1/doc");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.openapi).toBe("3.1.0");
    expect(body.info.title).toBe("Fairify API");
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
