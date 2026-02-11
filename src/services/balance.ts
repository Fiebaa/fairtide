import { eq, sql } from "drizzle-orm";
import { db, sqlite } from "../db/index.js";
import { realms, transactions } from "../db/schema.js";

export function recordTransaction(
  realmId: string,
  basePrice: number,
  fairPrice: number,
): void {
  const delta = Math.round((fairPrice - basePrice) * 100) / 100;

  // Atomic: insert transaction + update realm balance in one SQLite transaction
  sqlite.run("BEGIN IMMEDIATE");
  try {
    db.insert(transactions)
      .values({ realmId, basePrice, fairPrice, delta })
      .run();

    db.update(realms)
      .set({
        balance: sql`${realms.balance} + ${delta}`,
        totalTransactions: sql`${realms.totalTransactions} + 1`,
      })
      .where(eq(realms.id, realmId))
      .run();

    sqlite.run("COMMIT");
  } catch (err) {
    sqlite.run("ROLLBACK");
    throw err;
  }
}

export interface BalanceSummary {
  balance: number;
  totalTransactions: number;
  averageDelta: number;
}

export function getBalance(realmId: string): BalanceSummary {
  const realm = db
    .select({
      balance: realms.balance,
      totalTransactions: realms.totalTransactions,
    })
    .from(realms)
    .where(eq(realms.id, realmId))
    .get();

  if (!realm) {
    return { balance: 0, totalTransactions: 0, averageDelta: 0 };
  }

  const averageDelta =
    realm.totalTransactions > 0
      ? Math.round((realm.balance / realm.totalTransactions) * 100) / 100
      : 0;

  return {
    balance: Math.round(realm.balance * 100) / 100,
    totalTransactions: realm.totalTransactions,
    averageDelta,
  };
}
