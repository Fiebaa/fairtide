import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { realms } from "../db/schema.js";

function generateApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function generateId(): string {
  return crypto.randomUUID();
}

export async function createRealm(name: string) {
  const id = generateId();
  const apiKey = generateApiKey();

  db.insert(realms).values({ id, name, apiKey }).run();

  return { id, name, apiKey };
}

export async function getRealm(id: string) {
  return db.select().from(realms).where(eq(realms.id, id)).get();
}

export async function getRealmByApiKey(apiKey: string) {
  return db.select().from(realms).where(eq(realms.apiKey, apiKey)).get();
}
