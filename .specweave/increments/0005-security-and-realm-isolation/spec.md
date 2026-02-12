# Security & Realm Isolation - Specification

## Overview

Harden the Fairify API so that business customers can trust their realm is secure. API keys are hashed at rest (never stored in plain text), realm isolation is strictly enforced, and common API security best practices are applied. After this increment, a compromised database dump won't expose API keys, and no realm can access another's data.

## User Stories

### US-001: API Key Security

**As a** business customer,
**I want** my API key to be securely stored,
**So that** even if the database is compromised, my key cannot be extracted.

**Acceptance Criteria:**

- [x] AC-US1-01: API keys are hashed using SHA-256 before storage (only the hash is persisted)
- [x] AC-US1-02: The plain-text API key is returned ONLY on realm creation (never again)
- [x] AC-US1-03: Auth lookup compares hash of provided key against stored hash
- [x] AC-US1-04: Existing demo seed realm uses a hashed key

### US-002: Strict Realm Isolation

**As a** business customer,
**I want** my realm's data to be completely isolated from other realms,
**So that** no other customer can see or modify my data.

**Acceptance Criteria:**

- [x] AC-US2-01: The calculate endpoint only records transactions to the authenticated realm
- [x] AC-US2-02: GET /realms/:id returns 403 Forbidden (not 401) when accessing another realm's data
- [x] AC-US2-03: GET /realms/:id/balance returns 403 when accessing another realm's balance
- [x] AC-US2-04: A realm cannot enumerate other realms (no list endpoint)

### US-003: API Security Headers

**As a** developer integrating Fairify,
**I want** the API to follow security best practices,
**So that** common attack vectors are mitigated.

**Acceptance Criteria:**

- [x] AC-US3-01: Security headers added (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security)
- [x] AC-US3-02: Error responses never leak internal details (no stack traces, no DB schema hints)
- [x] AC-US3-03: POST /v1/realms is rate-limited to prevent mass realm creation abuse

## Out of Scope

- Key rotation (future increment)
- OAuth / JWT tokens (API keys are sufficient for now)
- IP allowlisting per realm (future increment)
- Audit logging (future increment)

## Technical Constraints

- Use Web Crypto API (available in Bun) for hashing — no external crypto libraries
- SHA-256 is sufficient for API key hashing (keys are high-entropy random, not passwords)
- Migration must handle existing plain-text keys in the database
- All changes must be backward-compatible with existing tests (update as needed)
