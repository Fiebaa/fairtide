import type { ErrorHandler } from "hono";
import { ZodError } from "zod";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof ZodError) {
    return c.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: err.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
        },
      },
      400,
    );
  }

  if (err instanceof NotFoundError) {
    return c.json(
      {
        error: {
          code: "NOT_FOUND",
          message: err.message,
        },
      },
      404,
    );
  }

  console.error("Unexpected error:", err);
  return c.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    },
    500,
  );
};
