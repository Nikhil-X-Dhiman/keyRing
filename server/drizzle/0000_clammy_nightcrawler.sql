CREATE TABLE `app_data` (
	`data_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`uuid` varchar(512) NOT NULL,
	`name` varchar(512),
	`username` varchar(512),
	`password` varchar(512),
	`uri` json,
	`favourite` boolean NOT NULL DEFAULT false,
	`note` text,
	`trash` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `app_data_data_id` PRIMARY KEY(`data_id`)
);
--> statement-breakpoint
CREATE TABLE `refresh_token` (
	`token_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`token` varchar(500) NOT NULL,
	`token_expiry` timestamp,
	`ip_address` varchar(50),
	`user_agent` varchar(255),
	`is_valid` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refresh_token_token_id` PRIMARY KEY(`token_id`),
	CONSTRAINT `refresh_token_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `auth` (
	`auth_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`password_hash` varchar(512) NOT NULL,
	`verify_token` varchar(255),
	`verify_token_expiry` timestamp,
	`reset_password_token` varchar(255),
	`reset_password_token_expiry` timestamp,
	`salt` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auth_auth_id` PRIMARY KEY(`auth_id`),
	CONSTRAINT `auth_verify_token_unique` UNIQUE(`verify_token`),
	CONSTRAINT `auth_reset_password_token_unique` UNIQUE(`reset_password_token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`role` enum('admin','customer') NOT NULL DEFAULT 'customer',
	`plan` enum('free','plus','pro') NOT NULL DEFAULT 'free',
	`is_active` boolean NOT NULL DEFAULT true,
	`failed_login_attempts` int NOT NULL DEFAULT 0,
	`last_login` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `app_data` ADD CONSTRAINT `app_data_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auth` ADD CONSTRAINT `auth_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;