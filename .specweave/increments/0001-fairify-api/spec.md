# Fairify API - Specification

## Overview

Fairify is a minimalistic API that calculates fair prices for consumables based on a person's income and the shop's location. It applies income-based and location-based adjustment factors to determine a fair price.

## User Stories

### US-001: Calculate Fair Price

**As a** developer integrating Fairify,
**I want to** submit a product price, income level, and shop location,
**So that** I receive a fair adjusted price.

**Acceptance Criteria:**

- [x] AC-US1-01: API accepts base price, annual income, and location identifier via POST /v1/calculate
- [x] AC-US1-02: Returns fair price with breakdown (income factor, location factor, final price)
- [x] AC-US1-03: Validates input (price > 0, income > 0, valid location)
- [x] AC-US1-04: Returns appropriate error responses for invalid input (400)

### US-002: API Health & Documentation

**As a** developer or operations engineer,
**I want to** check API health and access documentation,
**So that** I can monitor the service and understand the API contract.

**Acceptance Criteria:**

- [x] AC-US2-01: GET /v1/health returns status and version
- [x] AC-US2-02: OpenAPI 3.1 spec is auto-generated from route definitions
- [x] AC-US2-03: Swagger UI available at /v1/docs

### US-003: Location Cost-of-Living Data

**As a** system,
**I want to** store and retrieve cost-of-living multipliers per location,
**So that** fair price calculations use real location data.

**Acceptance Criteria:**

- [x] AC-US3-01: SQLite database stores location records with cost-of-living index
- [x] AC-US3-02: Seed data includes at least 10 reference locations
- [x] AC-US3-03: Unknown locations return 404 with helpful message

### US-004: Income-Based Pricing Model

**As a** product owner,
**I want** income brackets with corresponding adjustment factors,
**So that** lower-income users pay proportionally less.

**Acceptance Criteria:**

- [x] AC-US4-01: Income brackets are configurable (not hardcoded)
- [x] AC-US4-02: Default brackets: <20k (0.7), 20-40k (0.85), 40-70k (1.0), 70-100k (1.1), >100k (1.2)
- [x] AC-US4-03: Fair price formula: basePrice * incomeFactor * locationFactor

## Out of Scope

- User authentication / accounts
- Payment provider integration
- Frontend / UI
- Multi-currency support (future increment)

## Technical Constraints

- **Runtime**: Bun
- **Framework**: Hono
- **Database**: SQLite via Drizzle ORM
- **Validation**: Zod
- **Testing**: bun:test
- **API Spec**: OpenAPI 3.1 (auto-generated)
