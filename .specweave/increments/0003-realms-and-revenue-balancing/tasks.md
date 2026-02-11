# Realms & Revenue-Neutral Balancing - Tasks

## T-001: Database Schema for Realms and Transactions
**User Story**: US-001 | **Satisfies ACs**: AC-US1-04 | **Status**: [x] completed
**Test**: Given schema → When migration runs → Then realms and transactions tables exist with correct columns

- Add `realms` table to `src/db/schema.ts` (id, name, apiKey, balance, totalTransactions, dampingThreshold, createdAt)
- Add `transactions` table to `src/db/schema.ts` (id, realmId, basePrice, fairPrice, delta, createdAt)
- Generate and apply Drizzle migration
- Update seed script to create a demo realm with API key

## T-002: Realm Service
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03 | **Status**: [x] completed
**Test**: Given createRealm("Cafe Bar") → When called → Then realm created with 64-char hex API key; Given getRealm(id) → Then returns realm with balance

- Create `src/services/realm.ts` with createRealm, getRealm, getRealmByApiKey
- Generate secure API key using crypto.randomBytes (64-char hex)
- Add realm validation (name required, unique)

## T-003: API Key Authentication Middleware
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-04 | **Status**: [x] completed
**Test**: Given valid API key → When POST /v1/calculate → Then 200; Given invalid key → Then 401; Given GET /v1/health → Then 200 (no auth)

- Create `src/middleware/auth.ts`
- Extract Bearer token from Authorization header
- Look up realm by API key, attach to request context
- Return 401 for missing/invalid keys
- Apply only to /v1/calculate and /v1/realms/:id routes (not health/docs)

## T-004: Balance Tracking Service
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [x] completed
**Test**: Given realm with balance 0 → When transaction with delta -1.50 recorded → Then balance is -1.50 and totalTransactions is 1

- Create `src/services/balance.ts`
- recordTransaction(realmId, basePrice, fairPrice): atomically update realm balance and insert transaction
- getBalance(realmId): return balance summary (current, totalTransactions, avgDelta)
- Use SQLite transaction for atomicity

## T-005: Revenue-Neutral Pricing Algorithm
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02, AC-US3-03, AC-US3-04, AC-US3-05 | **Status**: [x] completed
**Test**: Given realm with balance -30 and threshold -50 → When low-income request → Then factor dampened toward 1.0; Given balanced realm → Then standard factors apply

- Modify `src/services/pricing.ts` to accept optional realm context
- Implement dampening coefficient: D = clamp(1 - balance / dampingThreshold, 0, 1) when balance < 0
- Adjusted factor = 1.0 + (standardFactor - 1.0) * D
- Add `balanceStatus` to response: "balanced" (|B| < 5), "recovering" (B < -5), "surplus" (B > 5)
- Keep backward compatibility: if no realm provided, use standard factors (no dampening)

## T-006: Realm API Routes
**User Story**: US-001, US-004 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US4-01, AC-US4-02 | **Status**: [x] completed
**Test**: Given POST /v1/realms with name → Then 201 with id and apiKey; Given GET /v1/realms/:id with valid key → Then realm details; Given GET /v1/realms/:id/balance → Then balance summary

- Create `src/routes/realms.ts` with OpenAPI schemas
- POST /v1/realms: create realm, return id + apiKey
- GET /v1/realms/:id: return realm details (requires auth)
- GET /v1/realms/:id/balance: return balance details (requires auth)
- Wire routes in src/index.ts

## T-007: Update Calculate Route for Realm Integration
**User Story**: US-002, US-003 | **Satisfies ACs**: AC-US2-01, AC-US3-01, AC-US3-04 | **Status**: [x] completed
**Test**: Given authenticated request → When POST /v1/calculate → Then response includes balanceStatus and transaction recorded; Given unauthenticated → Then 401

- Update `src/routes/calculate.ts` to require auth middleware
- Pass realm context to pricing service for dampened calculation
- Record transaction via balance service after calculation
- Add `balanceStatus` to response schema
- Update response OpenAPI spec

## T-008: Update Rate Limiting to Per-Realm
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [x] completed
**Test**: Given realm A at rate limit → When realm B sends request → Then realm B succeeds (separate limits)

- Modify `src/middleware/rate-limit.ts` to key by realmId instead of IP
- Fall back to IP-based for unauthenticated endpoints
- Keep configurable max/window from env

## T-009: Tests for Realms and Balancing
**User Story**: US-001, US-002, US-003, US-004 | **Satisfies ACs**: All | **Status**: [x] completed
**Test**: Full test suite passes including new realm and balancing tests

- Test realm CRUD (create, get, API key generation)
- Test auth middleware (valid key, invalid key, missing key, public endpoints)
- Test revenue-neutral algorithm (dampening at various balance levels)
- Test balance convergence (simulate 100 transactions, verify balance trends toward 0)
- Test per-realm rate limiting
- Test balance endpoint authentication
