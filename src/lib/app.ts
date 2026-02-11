import { OpenAPIHono } from "@hono/zod-openapi";

export function createRouter() {
  return new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Invalid request data",
              details: result.error.issues.map(
                (e) => `${e.path.join(".")}: ${e.message}`,
              ),
            },
          },
          400,
        );
      }
    },
  });
}
