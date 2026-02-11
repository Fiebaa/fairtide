import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const locations = sqliteTable("locations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  costOfLivingIndex: real("cost_of_living_index").notNull(),
});

export type Location = typeof locations.$inferSelect;
