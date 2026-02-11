import { describe, it, expect } from "bun:test";
import { getIncomeFactor, incomeBrackets } from "./income-brackets.js";

describe("incomeBrackets", () => {
  it("has 5 brackets", () => {
    expect(incomeBrackets).toHaveLength(5);
  });

  it("last bracket has no upper limit", () => {
    expect(incomeBrackets[4].maxIncome).toBeNull();
  });
});

describe("getIncomeFactor", () => {
  it("returns 0.7 for income below 20k", () => {
    expect(getIncomeFactor(10_000)).toBe(0.7);
    expect(getIncomeFactor(19_999)).toBe(0.7);
  });

  it("returns 0.7 for income exactly at 20k", () => {
    expect(getIncomeFactor(20_000)).toBe(0.7);
  });

  it("returns 0.85 for income 20k-40k", () => {
    expect(getIncomeFactor(20_001)).toBe(0.85);
    expect(getIncomeFactor(35_000)).toBe(0.85);
    expect(getIncomeFactor(40_000)).toBe(0.85);
  });

  it("returns 1.0 for income 40k-70k", () => {
    expect(getIncomeFactor(50_000)).toBe(1.0);
    expect(getIncomeFactor(70_000)).toBe(1.0);
  });

  it("returns 1.1 for income 70k-100k", () => {
    expect(getIncomeFactor(80_000)).toBe(1.1);
    expect(getIncomeFactor(100_000)).toBe(1.1);
  });

  it("returns 1.2 for income above 100k", () => {
    expect(getIncomeFactor(100_001)).toBe(1.2);
    expect(getIncomeFactor(500_000)).toBe(1.2);
  });
});
