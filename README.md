# Fairtide

A fair pricing API — prices rise and fall like the tide, so everyone gets a fair deal.

## How It Works

Fairtide adjusts prices using relative PPP (Purchasing Power Parity):

1. Each realm (merchant) has a seller country — where the purchase happens
2. Your income is adjusted using relative PPP: buyer's purchasing power vs. seller's local prices
3. The PPP-adjusted income determines an income factor via bracket lookup
4. The fair price is calculated from the base price and income factor

```
pppIncome = annualIncome × (sellerPppFactor / buyerPppFactor)
fairPrice = basePrice × incomeFactor(pppIncome)
```

### Income Brackets (PPP-Adjusted USD)

| PPP-Adjusted Income | Factor |
|---------------------|--------|
| Up to 20,000        | 0.70   |
| 20,001-40,000       | 0.85   |
| 40,001-70,000       | 1.00   |
| 70,001-100,000      | 1.10   |
| Over 100,000        | 1.20   |

~180 countries supported via ISO 3166-1 alpha-2 codes (e.g. "DE", "US", "NG").

## Prerequisites

- [Bun](https://bun.sh) v1.2+

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd fairtide

# Install dependencies
bun install

# Set up the database
bun run db:migrate
bun run db:seed

# Start the development server
bun run dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Calculate Fair Price

```
POST /v1/calculate
```

**Request:**

```json
{
  "basePrice": 10.00,
  "annualIncome": 35000,
  "countryCode": "DE"
}
```

**Response:**

```json
{
  "fairPrice": 8.50,
  "breakdown": {
    "basePrice": 10.00,
    "pppAdjustedIncome": 35000,
    "buyerPppFactor": 0.95,
    "sellerPppFactor": 0.95,
    "incomeFactor": 0.85,
    "fairPrice": 8.50
  }
}
```

### Create Realm

```
POST /v1/realms
```

**Request:**

```json
{
  "name": "My Coffee Shop",
  "countryCode": "DE"
}
```

**Response (201):**

```json
{
  "id": "abc-123",
  "name": "My Coffee Shop",
  "countryCode": "DE",
  "apiKey": "your-api-key-shown-only-once"
}
```

The `countryCode` is the seller's country (where the purchase happens). The `apiKey` is returned only on creation — store it securely.

### Health Check

```
GET /v1/health
```

### API Documentation

Interactive Swagger UI is available at:

```
GET /v1/docs
```

OpenAPI 3.1 spec at:

```
GET /v1/doc
```

## Docker

Run with Docker Compose:

```bash
docker compose up -d
```

The API will be available at `http://localhost:3000`.

To customize, set environment variables in your shell or a `.env` file:

```bash
PORT=8080 LOG_LEVEL=debug docker compose up -d
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `DB_PATH` | `./data/fairtide.db` | SQLite database path |
| `LOG_LEVEL` | `info` | Log level (`debug`, `info`, `warn`, `error`) |
| `CORS_ORIGIN` | `*` | Allowed origins (comma-separated or `*`) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window (ms) |

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run start` | Start production server |
| `bun test` | Run tests |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply database migrations |
| `bun run db:seed` | Seed demo realm |

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono
- **Database**: SQLite (via Drizzle ORM)
- **Validation**: Zod
- **API Docs**: OpenAPI 3.1 (auto-generated)
- **Testing**: bun:test

## License

AGPL-3.0 — see [LICENSE](LICENSE) for details.
