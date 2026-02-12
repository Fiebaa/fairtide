import { getPppFactor } from "../config/ppp-factors.js";
import { NotFoundError } from "../middleware/error-handler.js";

export function convertToPppIncome(
  annualIncome: number,
  countryCode: string,
): number {
  const factor = getPppFactor(countryCode);
  if (factor === undefined) {
    throw new NotFoundError(
      `Country code '${countryCode}' not found. Use a valid ISO 3166-1 alpha-2 code (e.g. 'DE', 'US').`,
    );
  }
  return Math.round(annualIncome * factor * 100) / 100;
}
