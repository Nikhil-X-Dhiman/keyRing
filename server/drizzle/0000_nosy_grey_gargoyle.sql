CREATE TABLE `login` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`name` varchar(255),
	`username` varchar(255),
	`password` varchar(255),
	`uri` json,
	`favorite` boolean NOT NULL DEFAULT false,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `login_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `refresh_token` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`token` varchar(255) NOT NULL,
	`token_expiry` timestamp,
	`ip_address` varchar(50),
	`user_agent` varchar(255),
	`is_valid` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refresh_token_id` PRIMARY KEY(`id`),
	CONSTRAINT `refresh_token_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `auth` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`password_hash` varchar(255) NOT NULL,
	`verify_token` varchar(255),
	`verify_token_expiry` timestamp,
	`reset_password_token` varchar(255),
	`reset_password_token_expiry` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auth_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_password_hash_unique` UNIQUE(`password_hash`),
	CONSTRAINT `auth_verify_token_unique` UNIQUE(`verify_token`),
	CONSTRAINT `auth_reset_password_token_unique` UNIQUE(`reset_password_token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`role` enum('admin','customer') NOT NULL DEFAULT 'customer',
	`plan` enum('free','plus','pro') NOT NULL DEFAULT 'free',
	`is_active` boolean NOT NULL DEFAULT true,
	`failed_login_attempts` int NOT NULL DEFAULT 0,
	`last_login` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `login` ADD CONSTRAINT `login_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auth` ADD CONSTRAINT `auth_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;