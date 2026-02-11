# Realms & Revenue-Neutral Balancing - Plan

## Architecture

### Revenue-Neutral Algorithm

The key insight: standard income factors (0.7, 0.85, 1.0, 1.1, 1.2) produce revenue-neutral results **only** when the income distribution is perfectly balanced. In practice, a cafe might serve more lower-income customers, creating a persistent loss.

**Solution: Adaptive Factor Dampening**

Given a realm's running balance `B` (sum of all deltas where delta = fairPrice - basePrice):

1. Calculate the standard factor `F` from income brackets (e.g., 0.7 for low income)
2. Compute a dampening coefficient `D` based on balance:
   - If `B < 0` (deficit): `D = clamp(1 - B / dampingThreshold, 0, 1)` — pulls factor toward 1.0
   - If `B > 0` (surplus): `D = 1.0` — no dampening, let standard factors apply
   - If `B ≈ 0` (balanced): `D = 1.0` — standard factors apply
3. Adjusted factor: `adjustedFactor = 1.0 + (F - 1.0) * D`

When balance is deeply negative, `D` approaches 0, making all factors converge to 1.0 (base price). As balance recovers, `D` returns to 1.0 and full fair pricing resumes.

The `dampingThreshold` is configurable per realm (default: -50.0, meaning at -€50 balance, factors are fully dampened).

### Database Schema Changes

```sql
-- New table: realms
CREATE TABLE realms (
  id TEXT PRIMARY KEY,           -- UUID
  name TEXT NOT NULL,             -- Business name
  apiKey TEXT NOT NULL UNIQUE,    -- Bearer token (64-char hex)
  balance REAL NOT NULL DEFAULT 0, -- Running revenue delta
  totalTransactions INTEGER NOT NULL DEFAULT 0,
  dampingThreshold REAL NOT NULL DEFAULT -50.0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- New table: transactions (for balance tracking, not full audit)
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  realmId TEXT NOT NULL REFERENCES realms(id),
  basePrice REAL NOT NULL,
  fairPrice REAL NOT NULL,
  delta REAL NOT NULL,            -- fairPrice - basePrice
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### API Changes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /v1/realms | None* | Create a realm |
| GET | /v1/realms/:id | Bearer | Get realm details |
| GET | /v1/realms/:id/balance | Bearer | Get balance details |
| POST | /v1/calculate | Bearer | Calculate price (now requires realm) |

*Realm creation is unauthenticated for now (operator creates realms). In a future increment, this could require an admin key.

### Middleware Changes

- New `auth.ts` middleware: extracts API key from Authorization header, resolves realm
- Rate limiting switches from per-IP to per-realm
- Request context gets `realmId` for transaction recording

### File Structure (new/modified)

```
src/
├── db/
│   └── schema.ts              # Add realms + transactions tables
├── middleware/
│   ├── auth.ts                # NEW: API key authentication
│   └── rate-limit.ts          # MODIFY: scope to realm
├── services/
│   ├── pricing.ts             # MODIFY: add balance-aware algorithm
│   ├── realm.ts               # NEW: realm CRUD
│   └── balance.ts             # NEW: balance tracking + dampening
├── routes/
│   ├── calculate.ts           # MODIFY: require auth, record transaction
│   └── realms.ts              # NEW: realm endpoints
└── config/
    └── env.ts                 # Add DEFAULT_DAMPING_THRESHOLD
```
