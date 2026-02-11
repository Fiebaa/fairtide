# Fairify API - Tasks

## T-001: Project Setup & Dependencies
**User Story**: US-001, US-002 | **Satisfies ACs**: — | **Status**: [x] completed
**Test**: Given a fresh clone → When `bun install && bun run dev` → Then server starts on port 3000

- Initialize TypeScript config (strict mode)
- Install dependencies: hono, @hono/zod-openapi, drizzle-orm, zod
- Install dev dependencies: drizzle-kit, bun-types
- Configure bun scripts: dev, start, test, db:generate, db:migrate, db:seed
- Setup project structure (src/, routes/, services/, db/, config/, lib/, middleware/)

## T-002: Database Schema & Migrations
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [x] completed
**Test**: Given drizzle config → When `bun run db:migrate` → Then locations table exists in SQLite

- Define Drizzle schema for locations table
- Configure Drizzle Kit for SQLite
- Generate and run initial migration

## T-003: Seed Location Data
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02 | **Status**: [x] completed
**Test**: Given empty DB → When `bun run db:seed` → Then 10+ locations with cost-of-living indices exist

- Create seed script with 10+ locations (mix of cities across cost-of-living spectrum)
- Include: Berlin, Munich, Zurich, New York, London, Tokyo, Bangkok, Lagos, São Paulo, Sydney

## T-004: Income Bracket Configuration
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02 | **Status**: [x] completed
**Test**: Given config → When reading income brackets → Then 5 brackets with factors returned

- Define income brackets as typed config
- Default: <20k=0.7, 20-40k=0.85, 40-70k=1.0, 70-100k=1.1, >100k=1.2
- Export lookup function: getIncomeFactor(annualIncome) → number

## T-005: Pricing Service
**User Story**: US-004 | **Satisfies ACs**: AC-US4-03 | **Status**: [x] completed
**Test**: Given basePrice=10, incomeFactor=0.85, locationFactor=1.05 → When calculateFairPrice() → Then returns 8.93

- Implement calculateFairPrice(basePrice, annualIncome, locationId)
- Formula: basePrice * incomeFactor * locationFactor
- Return breakdown object with all factors

## T-006: Location Service
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03 | **Status**: [x] completed
**Test**: Given "berlin-de" → When getLocation() → Then returns location with costOfLivingIndex; Given "unknown" → When getLocation() → Then throws NotFoundError

- Implement getLocation(locationId) → Location
- Implement getLocationFactor(locationId) → number
- Handle unknown locations with descriptive error

## T-007: POST /v1/calculate Endpoint
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04 | **Status**: [x] completed
**Test**: Given valid payload → When POST /v1/calculate → Then 200 with fairPrice and breakdown; Given invalid payload → When POST /v1/calculate → Then 400 with validation errors

- Define Zod schema for request/response (used for both validation and OpenAPI)
- Wire up pricing + location services
- Return structured response with breakdown

## T-008: Health & Docs Endpoints
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03 | **Status**: [x] completed
**Test**: Given running server → When GET /v1/health → Then 200 with status "ok"; When GET /v1/docs → Then Swagger UI rendered

- GET /v1/health returning status + version from package.json
- Auto-generate OpenAPI spec from Zod-OpenAPI routes
- Serve Swagger UI at /v1/docs

## T-009: Error Handling Middleware
**User Story**: US-001 | **Satisfies ACs**: AC-US1-04 | **Status**: [x] completed
**Test**: Given malformed JSON → When POST /v1/calculate → Then 400 with structured error; Given server error → Then 500 with safe message

- Global error handler middleware
- Structured error response format: { error: { code, message, details? } }
- Handle Zod validation errors, not-found errors, unexpected errors

## T-010: Integration Tests
**User Story**: US-001, US-002, US-003, US-004 | **Satisfies ACs**: All | **Status**: [x] completed
**Test**: Full test suite passes with >80% coverage

- Unit tests for pricing service (various income/location combos)
- Unit tests for income bracket lookup
- Integration tests for /v1/calculate (happy path + edge cases)
- Integration tests for /v1/health
- Test unknown location handling
