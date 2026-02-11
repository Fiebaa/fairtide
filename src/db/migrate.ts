import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./index.js";

migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations complete.");
