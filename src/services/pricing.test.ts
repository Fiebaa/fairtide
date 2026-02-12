import { describe, it, expect } from "bun:test";
import { calculateFairPrice } from "./pricing.js";

describe("calculateFairPrice", () => {
  it("calculates fair price for mid-income in Germany", () => {
    // DE PPP factor = 0.95, pppIncome = 35000 * 0.95 = 33250 → bracket ≤40000 → factor 0.85
    const result = calculateFairPrice(10, 35_000, "DE");
    expect(result.fairPrice).toBe(8.5);
    expect(result.breakdown.incomeFactor).toBe(0.85);
    expect(result.breakdown.pppAdjustedIncome).toBe(33250);
  });

  it("calculates fair price for low income in Switzerland", () => {
    // CH PPP factor = 0.65, pppIncome = 15000 * 0.65 = 9750 → bracket ≤20000 → factor 0.7
    const result = calculateFairPrice(10, 15_000, "CH");
    expect(result.fairPrice).toBe(7);
    expect(result.breakdown.incomeFactor).toBe(0.7);
    expect(result.breakdown.pppAdjustedIncome).toBe(9750);
  });

  it("calculates fair price for high income in Nigeria", () => {
    // NG PPP factor = 2.95, pppIncome = 120000 * 2.95 = 354000 → bracket >100000 → factor 1.2
    const result = calculateFairPrice(10, 120_000, "NG");
    expect(result.fairPrice).toBe(12);
    expect(result.breakdown.incomeFactor).toBe(1.2);
    expect(result.breakdown.pppAdjustedIncome).toBe(354000);
  });

  it("returns breakdown with all factors", () => {
    // JP PPP factor = 1.08, pppIncome = 50000 * 1.08 = 54000 → bracket ≤70000 → factor 1.0
    const result = calculateFairPrice(20, 50_000, "JP");
    expect(result.breakdown).toEqual({
      basePrice: 20,
      pppAdjustedIncome: 54000,
      incomeFactor: 1.0,
      fairPrice: 20,
    });
    expect(result.fairPrice).toBe(result.breakdown.fairPrice);
  });

  it("throws for unknown country code", () => {
    expect(() => calculateFairPrice(10, 35_000, "XX")).toThrow("not found");
  });
});
