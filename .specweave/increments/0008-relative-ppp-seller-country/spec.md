---
status: completed
---

# 0008 — Add Seller Country to Realm for Relative PPP Pricing

## Summary

The PPP formula from increment 0007 only used the buyer's country factor, ignoring where the purchase happens. A Swiss person (CH=0.65) buying coffee in Germany (DE=0.95) should have their purchasing power evaluated relative to German prices. This increment adds `countryCode` to the realm entity and implements relative PPP: `pppIncome = annualIncome × (sellerFactor / buyerFactor)`.

## User Stories

### US-001: Seller country on realm
**As a** merchant creating a realm,
**I want** to specify my country (seller country),
**So that** PPP calculations account for where the purchase happens, not just the buyer's origin.

**Acceptance Criteria:**
- [x] AC-US1-01: Realm schema includes `countryCode` (NOT NULL)
- [x] AC-US1-02: POST /v1/realms requires `countryCode` field
- [x] AC-US1-03: GET /v1/realms/:id returns `countryCode`
- [x] AC-US1-04: Invalid country code on realm creation returns 404

### US-002: Relative PPP formula
**As a** buyer,
**I want** my fair price to reflect both my country's purchasing power AND the seller's country,
**So that** pricing is accurate for cross-border transactions.

**Acceptance Criteria:**
- [x] AC-US2-01: Formula uses `annualIncome × (sellerFactor / buyerFactor)` when realm has countryCode
- [x] AC-US2-02: Same-country buyer/seller yields ratio 1.0 (no PPP adjustment)
- [x] AC-US2-03: Response breakdown includes `buyerPppFactor` and `sellerPppFactor`
- [x] AC-US2-04: Without realm, fallback to single-factor `annualIncome × buyerFactor`
- [x] AC-US2-05: Zero PPP factor is guarded against (throws error)
- [x] AC-US2-06: Extreme PPP ratios (e.g., CH→IN) produce valid results
