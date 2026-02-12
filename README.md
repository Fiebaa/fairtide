# Fairtide

A fair pricing API — prices rise and fall like the tide, so everyone gets a fair deal.

## How It Works

Fairtide adjusts prices using two factors:

- **Income factor** — lower-income users pay proportionally less
- **Location factor** — prices reflect the local cost of living

```
fairPrice = basePrice * incomeFactor * locationFactor
```

### Default Income Brackets

| Annual Income | Factor |
|---------------|--------|
| Up to 20,000  | 0.70   |
| 20,001-40,000 | 0.85   |
| 40,001-70,000 | 1.00   |
| 70,001-100,000| 1.10   |
| Over 100,000  | 1.20   |

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
  "locationId": "berlin-de"
}
```

**Response:**

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

## Available Locations

The database is seeded with 12 cities:

| ID | City | Country | Cost of Living Index |
|----|------|---------|---------------------|
| zurich-ch | Zurich | CH | 1.35 |
| new-york-us | New York | US | 1.25 |
| london-gb | London | GB | 1.20 |
| sydney-au | Sydney | AU | 1.15 |
| tokyo-jp | Tokyo | JP | 1.10 |
| vienna-at | Vienna | AT | 1.10 |
| munich-de | Munich | DE | 1.08 |
| berlin-de | Berlin | DE | 1.05 |
| lisbon-pt | Lisbon | PT | 0.85 |
| sao-paulo-br | Sao Paulo | BR | 0.75 |
| bangkok-th | Bangkok | TH | 0.60 |
| lagos-ng | Lagos | NG | 0.45 |

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
| `bun run db:seed` | Seed location data |

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono
- **Database**: SQLite (via Drizzle ORM)
- **Validation**: Zod
- **API Docs**: OpenAPI 3.1 (auto-generated)
- **Testing**: bun:test

## License

ISC
