import { createMiddleware } from "hono/factory";
import { getRealmByApiKey } from "../services/realm.js";
import type { Realm } from "../db/schema.js";

declare module "hono" {
  interface ContextVariableMap {
    realm: Realm;
  }
}

export const auth = createMiddleware(async (c, next) => {
  const header = c.req.header("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return c.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Missing or invalid Authorization header. Use: Bearer <api-key>",
        },
      },
      401,
    );
  }

  const apiKey = header.slice(7);
  const realm = await getRealmByApiKey(apiKey);

  if (!realm) {
    return c.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid API key",
        },
      },
      401,
    );
  }

  c.set("realm", realm);
  await next();
});
