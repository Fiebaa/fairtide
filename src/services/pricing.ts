import { getIncomeFactor } from "../config/income-brackets.js";
import { getLocationFactor } from "./location.js";
import type { Realm } from "../db/schema.js";

export type BalanceStatus = "balanced" | "recovering" | "surplus";

export interface PricingResult {
  fairPrice: number;
  breakdown: {
    basePrice: number;
    incomeFactor: number;
    locationFactor: number;
    adjustedIncomeFactor?: number;
    fairPrice: number;
  };
  balanceStatus?: BalanceStatus;
}

function computeDampeningCoefficient(
  balance: number,
  dampingThreshold: number,
): number {
  if (balance >= 0) return 1.0;
  // As balance approaches dampingThreshold, D approaches 0
  // D = clamp(1 - balance / dampingThreshold, 0, 1)
  // Note: balance is negative, dampingThreshold is negative
  // e.g. balance = -25, threshold = -50 → D = 1 - (-25 / -50) = 1 - 0.5 = 0.5
  const d = 1 - balance / dampingThreshold;
  return Math.max(0, Math.min(1, d));
}

function getBalanceStatus(balance: number): BalanceStatus {
  if (balance < -5) return "recovering";
  if (balance > 5) return "surplus";
  return "balanced";
}

export async function calculateFairPrice(
  basePrice: number,
  annualIncome: number,
  locationId: string,
  realm?: Realm,
): Promise<PricingResult> {
  const standardIncomeFactor = getIncomeFactor(annualIncome);
  const locationFactor = await getLocationFactor(locationId);

  let incomeFactor = standardIncomeFactor;

  if (realm) {
    const d = computeDampeningCoefficient(
      realm.balance,
      realm.dampingThreshold,
    );
    incomeFactor =
      Math.round((1.0 + (standardIncomeFactor - 1.0) * d) * 1000) / 1000;
  }

  const fairPrice =
    Math.round(basePrice * incomeFactor * locationFactor * 100) / 100;

  const result: PricingResult = {
    fairPrice,
    breakdown: {
      basePrice,
      incomeFactor: standardIncomeFactor,
      locationFactor,
      fairPrice,
    },
  };

  if (realm) {
    result.breakdown.adjustedIncomeFactor = incomeFactor;
    result.balanceStatus = getBalanceStatus(realm.balance);
  }

  return result;
}
