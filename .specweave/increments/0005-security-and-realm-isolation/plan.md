# Security & Realm Isolation - Plan

## Architecture

### API Key Hashing

Current flow:
```
Create realm → store plain key → auth compares plain key
```

New flow:
```
Create realm → hash key with SHA-256 → store hash only → return plain key once
Auth: hash incoming key → compare hash against stored hash
```

Using Web Crypto API (`crypto.subtle.digest`) available natively in Bun. SHA-256 is appropriate here because API keys are 64-char hex (256 bits of entropy) — this is not password hashing where bcrypt/argon2 would be needed.

### Key Storage

The `realms.apiKey` column changes from storing the plain key to storing the SHA-256 hex digest. A prefix `sha256:` is added so we can detect legacy plain-text keys during migration.

### Realm Isolation

Already partially implemented — auth middleware resolves realm, routes check `authRealm.id !== id`. Changes:
- Return 403 (Forbidden) instead of 401 for cross-realm access (semantically correct: you ARE authenticated, just not authorized)
- Ensure no endpoint leaks cross-realm data

### Security Headers

Add a `securityHeaders` middleware that sets standard headers on every response:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### Realm Creation Rate Limiting

Apply the existing `rateLimit` middleware to POST /v1/realms to prevent abuse. This uses IP-based limiting since realm creation is unauthenticated.

## Migration Strategy

1. Add hash utility functions
2. Update seed to store hashed demo key
3. Update auth middleware to hash incoming key before lookup
4. Update realm service to hash on creation
5. Update tests to work with hashed keys
