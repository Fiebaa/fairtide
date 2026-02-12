# Plan — 0007 PPP Pricing

## Approach

Replace the two-multiplier system (income factor × location factor) with a single PPP-normalized income factor. This is more economically sound — PPP converts income to a common purchasing-power basis before applying income brackets, eliminating the redundancy between income and location.

## Formula Change

**Before:** `fairPrice = basePrice × incomeFactor(rawIncome) × locationFactor(city) × dampening`
**After:** `pppIncome = annualIncome × pppFactor(countryCode)` → `fairPrice = basePrice × incomeFactor(pppIncome) × dampening`

## Key Decisions

- PPP factors stored as static config (same pattern as income-brackets.ts)
- US is reference country (factor = 1.0)
- Breaking API change: `locationId` → `countryCode`
- Locations DB table dropped via Drizzle migration
