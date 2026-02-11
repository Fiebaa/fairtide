# Production Readiness - Specification

## Overview

Make the Fairify API production-ready with proper deployment setup, API hardening, and observability. Target deployment: Docker on any VPS.

## User Stories

### US-001: Containerized Deployment

**As a** DevOps engineer,
**I want to** deploy Fairify via Docker,
**So that** I can run it reliably on any VPS.

**Acceptance Criteria:**

- [x] AC-US1-01: Multi-stage Dockerfile builds a minimal production image
- [x] AC-US1-02: docker-compose.yml runs the full stack (app + persistent DB volume)
- [x] AC-US1-03: Environment variables configure port, DB path, and log level
- [x] AC-US1-04: Graceful shutdown on SIGTERM (closes DB connections, drains requests)

### US-002: API Hardening

**As a** developer consuming the API,
**I want** the API to be secure and resilient,
**So that** it handles abuse and edge cases gracefully.

**Acceptance Criteria:**

- [x] AC-US2-01: Rate limiting applied to POST /v1/calculate (configurable via env)
- [x] AC-US2-02: CORS configured for allowed origins (configurable via env)
- [x] AC-US2-03: Every response includes a unique X-Request-Id header
- [x] AC-US2-04: Response compression enabled (gzip)

### US-003: Observability

**As an** operations engineer,
**I want** structured logging and meaningful health checks,
**So that** I can monitor the service in production.

**Acceptance Criteria:**

- [x] AC-US3-01: Structured JSON logging with timestamp, level, requestId, and duration
- [x] AC-US3-02: GET /v1/health checks DB connectivity and returns detailed status
- [x] AC-US3-03: Request/response logging with configurable log level (env LOG_LEVEL)

## Out of Scope

- Kubernetes / Helm charts
- CI/CD pipeline (future increment)
- APM / distributed tracing (future increment)
- TLS termination (handled by reverse proxy)

## Technical Constraints

- Keep Bun as runtime (no Node.js switch)
- Docker image should be < 100MB
- Zero additional infrastructure dependencies (no Redis, no external services)
