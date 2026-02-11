import { getIncomeFactor } from "../config/income-brackets.js";
import { getLocationFactor } from "./location.js";

export interface PricingResult {
  fairPrice: number;
  breakdown: {
    basePrice: number;
    incomeFactor: number;
    locationFactor: number;
    fairPrice: number;
  };
}

export async function calculateFairPrice(
  basePrice: number,
  annualIncome: number,
  locationId: string,
): Promise<PricingResult> {
  const incomeFactor = getIncomeFactor(annualIncome);
  const locationFactor = await getLocationFactor(locationId);

  const fairPrice =
    Math.round(basePrice * incomeFactor * locationFactor * 100) / 100;

  return {
    fairPrice,
    breakdown: {
      basePrice,
      incomeFactor,
      locationFactor,
      fairPrice,
    },
  };
}
