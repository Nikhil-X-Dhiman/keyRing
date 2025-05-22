ALTER TABLE `auth` MODIFY COLUMN `update_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `session` MODIFY COLUMN `updated_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255) NOT NULL;