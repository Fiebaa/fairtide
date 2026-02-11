# Production Readiness - Tasks

## T-001: Environment Configuration
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03 | **Status**: [x] completed
**Test**: Given env vars → When server starts → Then config reflects env values; Given no env vars → Then defaults used

- Create src/config/env.ts with typed config from environment
- Create .env.example documenting all variables
- Update src/index.ts to use centralized config

## T-002: Request ID Middleware
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [x] completed
**Test**: Given any request → When response returned → Then X-Request-Id header present with UUID

- Create src/middleware/request-id.ts
- Generate UUID per request, attach to context
- Add X-Request-Id to every response

## T-003: Structured Logging
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-03 | **Status**: [x] completed
**Test**: Given POST /v1/calculate → When request completes → Then JSON log line with timestamp, level, requestId, method, path, status, duration

- Create src/middleware/logger.ts
- JSON format with configurable log level via LOG_LEVEL env
- Include requestId from request-id middleware

## T-004: Rate Limiting
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed
**Test**: Given rate limit of 3/min → When 4th request sent → Then 429 Too Many Requests returned

- Create src/middleware/rate-limit.ts (in-memory token bucket per IP)
- Configurable via RATE_LIMIT_MAX and RATE_LIMIT_WINDOW_MS
- Return Retry-After header on 429

## T-005: CORS & Compression
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02, AC-US2-04 | **Status**: [x] completed
**Test**: Given CORS_ORIGIN=https://example.com → When request from that origin → Then CORS headers present; Given any response → Then gzip compressed

- Add Hono CORS middleware with configurable origins
- Add Hono compress middleware

## T-006: Enhanced Health Check
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02 | **Status**: [x] completed
**Test**: Given healthy DB → When GET /v1/health → Then status "ok" with db: "connected"; Given broken DB → Then status "degraded" with db: "error"

- Update health route to query DB (SELECT 1)
- Return detailed status: { status, version, db, uptime }

## T-007: Graceful Shutdown
**User Story**: US-001 | **Satisfies ACs**: AC-US1-04 | **Status**: [x] completed
**Test**: Given running server → When SIGTERM received → Then server stops accepting new requests and exits cleanly

- Handle SIGTERM and SIGINT signals
- Close DB connection
- Log shutdown event

## T-008: Dockerfile & Docker Compose
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02 | **Status**: [x] completed
**Test**: Given Dockerfile → When `docker compose up` → Then API responds at localhost:3000 with health ok

- Multi-stage Dockerfile (install → runtime)
- docker-compose.yml with volume for /app/data
- .dockerignore for node_modules, .git, data/
- Docker health check

## T-009: Tests for New Middleware
**User Story**: US-002, US-003 | **Satisfies ACs**: All | **Status**: [x] completed
**Test**: Full test suite passes including new middleware tests

- Test request-id middleware (UUID present)
- Test rate limiting (429 after limit)
- Test structured log output format
- Test enhanced health check (DB up/down)
- Test CORS headers
