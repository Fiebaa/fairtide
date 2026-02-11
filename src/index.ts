import { swaggerUI } from "@hono/swagger-ui";
import { createRouter } from "./lib/app.js";
import { healthRoute } from "./routes/health.js";
import { calculateRoute } from "./routes/calculate.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = createRouter();

app.onError(errorHandler);

// Routes
app.route("/v1", healthRoute);
app.route("/v1", calculateRoute);

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

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};

export { app };
