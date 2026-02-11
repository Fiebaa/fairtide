# Backend Memory

<!-- Project-specific learnings for this skill -->

## Learnings

- **2026-02-11**: Fairify project uses bun:sqlite (not better-sqlite3) due to NODE_MODULE_VERSION mismatch with Bun runtime; paired with drizzle-orm/bun-sqlite and bun:test (not vitest which cannot load bun:sqlite modules)
- **2026-02-11**: Fairify uses createRouter() factory in src/lib/app.ts that creates OpenAPIHono instances with defaultHook for consistent validation error formatting; each route file must call createRouter() to inherit this behavior
