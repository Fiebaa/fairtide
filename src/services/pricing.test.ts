import { describe, it, expect } from "bun:test";
import { calculateFairPrice } from "./pricing.js";

describe("calculateFairPrice", () => {
  it("calculates fair price for mid-income in Berlin", async () => {
    const result = await calculateFairPrice(10, 35_000, "berlin-de");
    expect(result.fairPrice).toBe(8.93);
    expect(result.breakdown.incomeFactor).toBe(0.85);
    expect(result.breakdown.locationFactor).toBe(1.05);
  });

  it("calculates fair price for low income in expensive city", async () => {
    const result = await calculateFairPrice(10, 15_000, "zurich-ch");
    expect(result.fairPrice).toBe(9.45);
    expect(result.breakdown.incomeFactor).toBe(0.7);
    expect(result.breakdown.locationFactor).toBe(1.35);
  });

  it("calculates fair price for high income in cheap city", async () => {
    const result = await calculateFairPrice(10, 120_000, "lagos-ng");
    expect(result.fairPrice).toBe(5.4);
    expect(result.breakdown.incomeFactor).toBe(1.2);
    expect(result.breakdown.locationFactor).toBe(0.45);
  });

  it("returns breakdown with all factors", async () => {
    const result = await calculateFairPrice(20, 50_000, "tokyo-jp");
    expect(result.breakdown).toEqual({
      basePrice: 20,
      incomeFactor: 1.0,
      locationFactor: 1.1,
      fairPrice: 22,
    });
    expect(result.fairPrice).toBe(result.breakdown.fairPrice);
  });

  it("throws for unknown location", async () => {
    expect(calculateFairPrice(10, 35_000, "nowhere")).rejects.toThrow(
      "not found",
    );
  });
});
