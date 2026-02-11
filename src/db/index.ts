import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema.js";

const DB_PATH = process.env.DB_PATH || "./data/fairify.db";

const sqlite = new Database(DB_PATH);
sqlite.run("PRAGMA journal_mode = WAL");

export const db = drizzle({ client: sqlite, schema });
