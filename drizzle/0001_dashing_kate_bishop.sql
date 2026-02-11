CREATE TABLE `realms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`api_key` text NOT NULL,
	`balance` real DEFAULT 0 NOT NULL,
	`total_transactions` integer DEFAULT 0 NOT NULL,
	`damping_threshold` real DEFAULT -50 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `realms_api_key_unique` ON `realms` (`api_key`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`realm_id` text NOT NULL,
	`base_price` real NOT NULL,
	`fair_price` real NOT NULL,
	`delta` real NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`realm_id`) REFERENCES `realms`(`id`) ON UPDATE no action ON DELETE no action
);
