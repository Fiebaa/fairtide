import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { createRouter } from "./lib/app.js";
import { healthRoute } from "./routes/health.js";
import { calculateRoute } from "./routes/calculate.js";
import { realmRouter } from "./routes/realms.js";
import { errorHandler } from "./middleware/error-handler.js";
import { requestId } from "./middleware/request-id.js";
import { logger } from "./middleware/logger.js";
import { rateLimit } from "./middleware/rate-limit.js";
import { sqlite } from "./db/index.js";
import { config } from "./config/env.js";

const app = createRouter();

// Middleware (order matters)
app.use("*", requestId);
app.use("*", logger);
app.use("*", compress());
app.use(
  "*",
  cors({
    origin: config.corsOrigin === "*" ? "*" : config.corsOrigin.split(","),
  }),
);
// Rate limiting is handled per-realm in the rateLimit middleware
app.use("/v1/calculate", rateLimit);

app.onError(errorHandler);

// Routes
app.route("/v1", healthRoute);
app.route("/v1", calculateRoute);
app.route("/v1", realmRouter);

// OpenAPI docs
app.doc("/v1/doc", {
  openapi: "3.1.0",
  info: {
    title: "Fairify API",
    version: "0.1.0",
    description:
      "Calculate fair prices for consumables based on income and location",
  },
});

app.get("/v1/docs", swaggerUI({ url: "/v1/doc" }));

// Graceful shutdown
function shutdown(signal: string) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "info",
      message: `Received ${signal}, shutting down gracefully`,
    }),
  );
  sqlite.close();
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default {
  port: config.port,
  fetch: app.fetch,
};

export { app };
