# Plan: Relative PPP Pricing

## Architecture

Add `countryCode` to realm entity → pass to PPP service as seller country → use relative PPP formula.

## Formula

**Before**: `pppIncome = annualIncome × buyerPppFactor`
**After**: `pppIncome = annualIncome × (sellerPppFactor / buyerPppFactor)`

## Files Changed

1. `src/db/schema.ts` — Add `countryCode` to realms table
2. `src/db/seed.ts` — Add `countryCode: "DE"` to demo realm
3. `src/services/realm.ts` — Accept and validate countryCode
4. `src/routes/realms.ts` — Add countryCode to create/get schemas
5. `src/services/ppp.ts` — Add optional sellerCountryCode param
6. `src/services/pricing.ts` — Pass realm.countryCode, add PPP factors to breakdown
7. `src/routes/calculate.ts` — Add PPP factor fields to breakdown schema
8. `drizzle/0003_friendly_prodigy.sql` — Migration for country_code column
