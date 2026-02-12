import { getPppFactor } from "../config/ppp-factors.js";
import { NotFoundError } from "../middleware/error-handler.js";

/**
 * Convert annual income to PPP-adjusted income.
 *
 * With sellerCountryCode (relative PPP):
 *   pppIncome = annualIncome × (sellerFactor / buyerFactor)
 *
 * Without sellerCountryCode (single-factor fallback):
 *   pppIncome = annualIncome × buyerFactor
 */
export function convertToPppIncome(
  annualIncome: number,
  buyerCountryCode: string,
  sellerCountryCode?: string,
): number {
  const buyerFactor = getPppFactor(buyerCountryCode);
  if (buyerFactor === undefined) {
    throw new NotFoundError(
      `Country code '${buyerCountryCode}' not found. Use a valid ISO 3166-1 alpha-2 code (e.g. 'DE', 'US').`,
    );
  }

  if (sellerCountryCode) {
    const sellerFactor = getPppFactor(sellerCountryCode);
    if (sellerFactor === undefined) {
      throw new NotFoundError(
        `Seller country code '${sellerCountryCode}' not found.`,
      );
    }
    return Math.round((annualIncome * sellerFactor) / buyerFactor * 100) / 100;
  }

  return Math.round(annualIncome * buyerFactor * 100) / 100;
}
