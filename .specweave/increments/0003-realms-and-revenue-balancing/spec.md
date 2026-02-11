# Realms & Revenue-Neutral Balancing - Specification

## Overview

Add multi-tenant support (realms) with API key authentication and a revenue-neutral pricing algorithm. Each realm (business customer) gets an API key. The pricing algorithm dynamically adjusts income factors so that cumulative discounts and premiums balance out — ensuring the business owner doesn't lose money.

## User Stories

### US-001: Realm Management

**As a** Fairify operator,
**I want to** create and manage realms via API,
**So that** each business customer has their own isolated API key and balance tracking.

**Acceptance Criteria:**

- [x] AC-US1-01: POST /v1/realms creates a realm with name and returns an API key
- [x] AC-US1-02: GET /v1/realms/:id returns realm details including current balance
- [x] AC-US1-03: API keys are securely generated (random, 32+ characters)
- [x] AC-US1-04: Realm data persisted in SQLite (realms table)

### US-002: API Key Authentication

**As a** business customer (cafe owner),
**I want to** authenticate my API calls with an API key,
**So that** my pricing calculations are tracked under my realm.

**Acceptance Criteria:**

- [x] AC-US2-01: POST /v1/calculate requires Authorization header with valid API key
- [x] AC-US2-02: Invalid or missing API key returns 401 Unauthorized
- [x] AC-US2-03: Rate limiting scoped per realm (not per IP)
- [x] AC-US2-04: Existing health/docs endpoints remain public (no auth required)

### US-003: Revenue-Neutral Pricing Algorithm

**As a** business customer,
**I want** the fair pricing to be revenue-neutral,
**So that** discounts given to lower-income customers are offset by premiums from higher-income customers.

**Acceptance Criteria:**

- [x] AC-US3-01: Each calculation records the delta (fairPrice - basePrice) to the realm's running balance
- [x] AC-US3-02: When balance is negative (too many discounts), the algorithm nudges factors toward 1.0 to recover
- [x] AC-US3-03: When balance is positive (excess premiums), the algorithm relaxes back to standard factors
- [x] AC-US3-04: The response includes a `balanceStatus` field ("balanced", "recovering", "surplus")
- [x] AC-US3-05: Over a sufficient volume of transactions, the cumulative balance converges toward zero

### US-004: Realm Balance Visibility

**As a** business customer,
**I want to** check my realm's revenue balance,
**So that** I can see whether fair pricing is costing me money.

**Acceptance Criteria:**

- [x] AC-US4-01: GET /v1/realms/:id/balance returns current balance, total transactions, and average delta
- [x] AC-US4-02: Balance endpoint requires the realm's own API key for authentication

## Out of Scope

- Admin UI / dashboard (future increment)
- Billing / subscription management
- Custom income brackets per realm (future increment)
- Custom locations per realm (future increment)
- Transaction history / audit log (future increment)

## Technical Constraints

- Keep SQLite as database (no PostgreSQL switch)
- API key passed via `Authorization: Bearer <key>` header
- Balance tracking must be atomic (no race conditions on concurrent requests)
- Revenue-balancing algorithm must be deterministic and testable
