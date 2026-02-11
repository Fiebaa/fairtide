# Fairify API - Technical Plan

## Architecture

```
src/
├── index.ts              # Entry point, Hono app setup
├── routes/
│   ├── calculate.ts      # POST /v1/calculate
│   ├── health.ts         # GET /v1/health
│   └── docs.ts           # GET /v1/docs (Swagger UI)
├── services/
│   ├── pricing.ts        # Fair price calculation logic
│   └── location.ts       # Location lookup service
├── db/
│   ├── schema.ts         # Drizzle schema definitions
│   ├── index.ts          # DB connection
│   ├── seed.ts           # Seed data script
│   └── migrations/       # Drizzle migrations
├── config/
│   └── income-brackets.ts # Configurable income bracket definitions
└── middleware/
    └── error-handler.ts  # Global error handling
```

## API Design

### POST /v1/calculate

**Request:**
```json
{
  "basePrice": 10.00,
  "annualIncome": 35000,
  "locationId": "berlin-de"
}
```

**Response (200):**
```json
{
  "fairPrice": 8.93,
  "breakdown": {
    "basePrice": 10.00,
    "incomeFactor": 0.85,
    "locationFactor": 1.05,
    "fairPrice": 8.93
  }
}
```

### GET /v1/health

**Response (200):**
```json
{
  "status": "ok",
  "version": "0.1.0"
}
```

## Database Schema

### locations
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Slug identifier (e.g. "berlin-de") |
| name | TEXT | Display name |
| country | TEXT | ISO country code |
| costOfLivingIndex | REAL | Multiplier (1.0 = baseline) |

## Key Decisions

1. **Hono + Bun**: Fastest startup, native TypeScript, built-in OpenAPI support via @hono/zod-openapi
2. **SQLite**: Zero-config, single-file DB, perfect for MVP. Migration path to Postgres exists via Drizzle.
3. **Zod schemas as single source**: Define once, used for validation + OpenAPI generation
4. **Income brackets in config**: Easy to adjust without code changes
