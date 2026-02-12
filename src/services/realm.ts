import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { realms } from "../db/schema.js";
import { hashApiKey } from "../utils/crypto.js";
import { getPppFactor } from "../config/ppp-factors.js";
import { NotFoundError } from "../middleware/error-handler.js";

function generateApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function generateId(): string {
  return crypto.randomUUID();
}

export async function createRealm(name: string, countryCode: string) {
  if (getPppFactor(countryCode) === undefined) {
    throw new NotFoundError(
      `Country code '${countryCode}' not found. Use a valid ISO 3166-1 alpha-2 code (e.g. 'DE', 'US').`,
    );
  }

  const id = generateId();
  const plainKey = generateApiKey();
  const hashedKey = hashApiKey(plainKey);

  db.insert(realms)
    .values({ id, name, countryCode, apiKey: hashedKey })
    .run();

  // Plain key returned only here — never stored, never retrievable again
  return { id, name, countryCode, apiKey: plainKey };
}

export async function getRealm(id: string) {
  return db.select().from(realms).where(eq(realms.id, id)).get();
}

export async function getRealmByApiKey(plainKey: string) {
  const hashedKey = hashApiKey(plainKey);
  return db.select().from(realms).where(eq(realms.apiKey, hashedKey)).get();
}
