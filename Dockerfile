FROM oven/bun:1.2 AS install
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM oven/bun:1.2-slim
WORKDIR /app
COPY --from=install /app/node_modules ./node_modules
COPY src/ ./src/
COPY drizzle/ ./drizzle/
COPY package.json drizzle.config.ts ./
RUN mkdir -p data

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:3000/v1/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["sh", "-c", "bun run db:migrate && bun run db:seed && bun run start"]
