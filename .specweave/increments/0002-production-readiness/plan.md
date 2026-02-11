# Production Readiness - Technical Plan

## Architecture Changes

```
src/
├── index.ts              # Updated: graceful shutdown, env config
├── middleware/
│   ├── error-handler.ts  # Existing
│   ├── logger.ts         # NEW: structured JSON request logging
│   ├── request-id.ts     # NEW: X-Request-Id generation
│   └── rate-limit.ts     # NEW: in-memory rate limiter
├── routes/
│   └── health.ts         # Updated: DB connectivity check
└── config/
    └── env.ts            # NEW: centralized env config with defaults

Dockerfile              # NEW: multi-stage build
docker-compose.yml      # NEW: app + DB volume
.dockerignore           # NEW
.env.example            # NEW: documented env vars
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| DB_PATH | ./data/fairify.db | SQLite database path |
| LOG_LEVEL | info | Log level (debug, info, warn, error) |
| CORS_ORIGIN | * | Allowed CORS origins (comma-separated) |
| RATE_LIMIT_MAX | 100 | Max requests per window |
| RATE_LIMIT_WINDOW_MS | 60000 | Rate limit window (ms) |

## Docker Strategy

- **Build stage**: Install deps + compile
- **Runtime stage**: Minimal Bun image, copy only built artifacts + DB migrations
- **Volume**: `/app/data` for persistent SQLite storage
- **Health check**: `curl -f http://localhost:3000/v1/health`

## Rate Limiting Approach

In-memory token bucket per IP. No Redis needed for MVP scale. Configurable via env vars.

## Logging Format

```json
{
  "timestamp": "2026-02-11T10:00:00.000Z",
  "level": "info",
  "requestId": "abc-123",
  "method": "POST",
  "path": "/v1/calculate",
  "status": 200,
  "duration": 12
}
```
