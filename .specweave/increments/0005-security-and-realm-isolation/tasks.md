# Security & Realm Isolation - Tasks

## T-001: API Key Hashing Utility
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed
**Test**: Given a plain-text key → When hashApiKey called → Then returns consistent SHA-256 hex digest

- Create `src/utils/crypto.ts` with `hashApiKey(key: string): string`
- Use Bun's native `crypto` (or Web Crypto) for SHA-256
- Returns hex-encoded hash string
- Pure function, no side effects

## T-002: Update Realm Service to Hash Keys
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04 | **Status**: [x] completed
**Test**: Given createRealm("Test") → When realm created → Then stored apiKey is SHA-256 hash; Given getRealmByApiKey(plainKey) → Then realm found by hashing input first

- Update `src/services/realm.ts`: hash key before storing in DB
- Update `getRealmByApiKey` to hash input key before lookup
- Return plain key only from `createRealm` (never from getRealm)
- Update `src/db/seed.ts`: store hashed demo key

## T-003: Fix Realm Isolation (403 vs 401)
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04 | **Status**: [x] completed
**Test**: Given realm A authenticated → When GET /realms/B → Then 403 Forbidden (not 401)

- Update `src/routes/realms.ts`: return 403 for cross-realm access
- Add 403 response schema to OpenAPI definitions
- Verify no list-all-realms endpoint exists (AC-US2-04 — already true)

## T-004: Security Headers Middleware
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02 | **Status**: [x] completed
**Test**: Given any request → When response returned → Then includes X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security

- Create `src/middleware/security-headers.ts`
- Add X-Content-Type-Options: nosniff
- Add X-Frame-Options: DENY
- Add Strict-Transport-Security: max-age=31536000; includeSubDomains
- Wire in `src/index.ts` before other middleware
- Verify error handler never leaks stack traces (already uses structured errors — confirm)

## T-005: Rate Limit Realm Creation
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03 | **Status**: [x] completed
**Test**: Given 100+ POST /v1/realms in 1 minute → When limit exceeded → Then 429 returned

- Apply `rateLimit` middleware to POST /v1/realms in `src/index.ts`
- Uses IP-based rate limiting (unauthenticated endpoint)

## T-006: Update Tests
**User Story**: US-001, US-002, US-003 | **Satisfies ACs**: All | **Status**: [x] completed
**Test**: Full test suite passes with hashed keys, 403 responses, and security headers

- Update test auth helper to work with hashed keys
- Add test: cross-realm access returns 403
- Add test: security headers present on responses
- Add test: realm creation returns API key only once
- Verify all existing tests still pass
