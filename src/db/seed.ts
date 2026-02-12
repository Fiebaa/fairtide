import { db } from "./index.js";
import { realms } from "./schema.js";
import { hashApiKey } from "../utils/crypto.js";

const DEMO_API_KEY = "demo-api-key-for-testing-only-do-not-use-in-production";

const demoRealm = {
  id: "demo-cafe",
  name: "Demo Cafe",
  apiKey: hashApiKey(DEMO_API_KEY),
};

db.insert(realms).values(demoRealm).onConflictDoNothing().run();
console.log("Seeded demo realm (hashed API key stored).");
