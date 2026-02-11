import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema.js";
import { config } from "../config/env.js";

const sqlite = new Database(config.dbPath);
sqlite.run("PRAGMA journal_mode = WAL");

export const db = drizzle({ client: sqlite, schema });
export { sqlite };
