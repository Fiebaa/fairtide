import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const realms = sqliteTable("realms", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  countryCode: text("country_code").notNull(),
  apiKey: text("api_key").notNull().unique(),
  balance: real("balance").notNull().default(0),
  totalTransactions: integer("total_transactions").notNull().default(0),
  dampingThreshold: real("damping_threshold").notNull().default(-50),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  realmId: text("realm_id")
    .notNull()
    .references(() => realms.id),
  basePrice: real("base_price").notNull(),
  fairPrice: real("fair_price").notNull(),
  delta: real("delta").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Realm = typeof realms.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
