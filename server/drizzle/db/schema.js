import {
	boolean,
	datetime,
	int,
	mysqlEnum,
	mysqlTable,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";
import { serial } from "drizzle-orm/pg-core";

export const userTable = mysqlTable("users", {
	userID: serial("user_id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	role: mysqlEnum("role", ["admin", "customer"]).default("customer").notNull(),
	plan: mysqlEnum("plan", ["free", "plus", "pro"]).default("free").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	lastLogin: datetime("last_login").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updateAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => sql`now()`)
		.notNull(),
});

export const userAuthTable = mysqlTable("auth", {
	id: serial("id").primaryKey(),
	userID: int("user_id").references(() => userTable.userID),
	passwordHash: varchar("password_hash", { length: 255 }).unique().notNull(),
	verifyToken: varchar("verify_token", { length: 255 }).unique().notNull(),
	verifyTokenExpiry: timestamp("verify_token_expiry", {
		withTimezone: true,
	}),
	resetPasswordToken: varchar("password_hash", { length: 255 }).unique(),
	resetPasswordTokenExpiry: timestamp("reset_password_token_expiry", {
		withTimezone: true,
	}),
	failedLoginAttempts: int("failed_login_attempts").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updateAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => sql`now()`)
		.notNull(),
});

// ! TODO -> Main Website Password Storage Table Schema Here
