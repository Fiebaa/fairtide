import { describe, it, expect } from "bun:test";
import { calculateFairPrice } from "./pricing.js";
import type { Realm } from "../db/schema.js";

const germanRealm: Realm = {
  id: "test-de",
  name: "Test DE",
  countryCode: "DE",
  apiKey: "fake",
  balance: 0,
  totalTransactions: 0,
  dampingThreshold: -50,
  createdAt: "2024-01-01",
};

describe("calculateFairPrice", () => {
  describe("without realm (single-factor fallback)", () => {
    it("calculates fair price for mid-income in Germany", () => {
      // DE PPP factor = 0.95, pppIncome = 35000 * 0.95 = 33250 → bracket ≤40000 → factor 0.85
      const result = calculateFairPrice(10, 35_000, "DE");
      expect(result.fairPrice).toBe(8.5);
      expect(result.breakdown.incomeFactor).toBe(0.85);
      expect(result.breakdown.pppAdjustedIncome).toBe(33250);
      expect(result.breakdown.buyerPppFactor).toBe(0.95);
      expect(result.breakdown.sellerPppFactor).toBe(0.95);
    });

    it("throws for unknown country code", () => {
      expect(() => calculateFairPrice(10, 35_000, "XX")).toThrow("not found");
    });
  });

  describe("with realm (relative PPP)", () => {
    it("Croatian buyer at German seller", () => {
      // HR=1.25, DE=0.95, ratio=0.95/1.25=0.76
      // pppIncome = 15000 * 0.76 = 11400 → bracket ≤20000 → factor 0.70
      const result = calculateFairPrice(3, 15_000, "HR", germanRealm);
      expect(result.fairPrice).toBe(2.1);
      expect(result.breakdown.pppAdjustedIncome).toBe(11400);
      expect(result.breakdown.buyerPppFactor).toBe(1.25);
      expect(result.breakdown.sellerPppFactor).toBe(0.95);
    });

    it("Swiss buyer at German seller", () => {
      // CH=0.65, DE=0.95, ratio=0.95/0.65=1.4615...
      // pppIncome = 120000 * 0.95 / 0.65 = 175384.62 → bracket >100000 → factor 1.20
      const result = calculateFairPrice(3, 120_000, "CH", germanRealm);
      expect(result.fairPrice).toBe(3.6);
      expect(result.breakdown.buyerPppFactor).toBe(0.65);
      expect(result.breakdown.sellerPppFactor).toBe(0.95);
    });

    it("same-country buyer and seller yields ratio 1.0", () => {
      // DE buyer at DE seller: ratio = 0.95/0.95 = 1.0
      // pppIncome = 35000 * 1.0 = 35000 → bracket ≤40000 → factor 0.85
      const result = calculateFairPrice(10, 35_000, "DE", germanRealm);
      expect(result.fairPrice).toBe(8.5);
      expect(result.breakdown.pppAdjustedIncome).toBe(35000);
    });

    it("handles extreme PPP ratio (CH buyer at Indian seller)", () => {
      // CH=0.65, IN=3.75, ratio=3.75/0.65=5.769...
      // pppIncome = 50000 * 5.769 = 288461.54 → bracket >100000 → factor 1.20
      const indiaRealm: Realm = { ...germanRealm, id: "test-in", countryCode: "IN" };
      const result = calculateFairPrice(10, 50_000, "CH", indiaRealm);
      expect(result.fairPrice).toBe(12);
      expect(isFinite(result.fairPrice)).toBe(true);
      expect(result.breakdown.buyerPppFactor).toBe(0.65);
      expect(result.breakdown.sellerPppFactor).toBe(3.75);
    });

    it("throws for invalid seller country in realm", () => {
      const badRealm: Realm = { ...germanRealm, id: "test-bad", countryCode: "XX" };
      expect(() => calculateFairPrice(10, 35_000, "DE", badRealm)).toThrow("not found");
    });

    it("returns full breakdown with PPP factors", () => {
      // JP buyer at DE seller: JP=1.08, DE=0.95, ratio=0.95/1.08=0.8796...
      // pppIncome = 50000 * 0.95 / 1.08 = 43981.48 → bracket ≤70000 → factor 1.0
      const result = calculateFairPrice(20, 50_000, "JP", germanRealm);
      expect(result.breakdown.basePrice).toBe(20);
      expect(result.breakdown.buyerPppFactor).toBe(1.08);
      expect(result.breakdown.sellerPppFactor).toBe(0.95);
      expect(result.breakdown.incomeFactor).toBe(1.0);
      expect(result.fairPrice).toBe(result.breakdown.fairPrice);
    });
  });
});
