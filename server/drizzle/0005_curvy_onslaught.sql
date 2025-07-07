ALTER TABLE `auth` ADD `salt` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `auth` ADD CONSTRAINT `auth_salt_unique` UNIQUE(`salt`);