# 0007 — Replace Location Factor with PPP-Adjusted Income

## Summary

Replace the manual location-based cost-of-living factor with PPP (Purchasing Power Parity) normalization. Instead of `fairPrice = basePrice × incomeFactor(rawIncome) × locationFactor(city) × dampening`, the new formula is `pppIncome = annualIncome × pppFactor(countryCode)` → `fairPrice = basePrice × incomeFactor(pppIncome) × dampening`.

## User Stories

### US-001: PPP-adjusted pricing
**As a** merchant using the Fairtide API,
**I want** fair prices calculated using PPP-adjusted income,
**So that** pricing reflects real purchasing power across ~180 countries instead of 12 hardcoded cities.

**Acceptance Criteria:**
- [x] AC-US1-01: API accepts `countryCode` (ISO 3166-1 alpha-2) instead of `locationId`
- [x] AC-US1-02: Income is multiplied by PPP factor before bracket lookup
- [x] AC-US1-03: Response breakdown includes `pppAdjustedIncome`, no `locationFactor`
- [x] AC-US1-04: Unknown country codes return 404 with descriptive error
- [x] AC-US1-05: ~180 countries supported via static PPP factor table
- [x] AC-US1-06: Locations table and service removed, migration generated
