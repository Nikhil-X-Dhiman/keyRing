import { relations, sql } from "drizzle-orm";
import {
	boolean,
	datetime,
	int,
	json,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

// Track users
export const userTable = mysqlTable("users", {
	userID: int("user_id").autoincrement().primaryKey(),
	username: varchar("username", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	role: mysqlEnum("role", ["admin", "customer"]).default("customer").notNull(),
	plan: mysqlEnum("plan", ["free", "plus", "pro"]).default("free").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	failedLoginAttempts: int("failed_login_attempts").default(0).notNull(),
	lastLogin: datetime("last_login"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Track user Auth details
export const userAuthTable = mysqlTable("auth", {
	authID: int("auth_id").autoincrement().primaryKey(),
	userID: int("user_id").references(() => userTable.userID, {
		onDelete: "cascade",
	}),
	passwordHash: varchar("password_hash", { length: 512 }).notNull(),
	verifyToken: varchar("verify_token", { length: 255 }).unique(),
	verifyTokenExpiry: timestamp("verify_token_expiry", {
		withTimezone: true,
	}),
	resetPasswordToken: varchar("reset_password_token", { length: 255 }).unique(),
	resetPasswordTokenExpiry: timestamp("reset_password_token_expiry", {
		withTimezone: true,
	}),
	salt: varchar("salt", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Track user Session Details
export const refreshTokenTable = mysqlTable("refresh_token", {
	tokenID: int("token_id").autoincrement().primaryKey(),
	userID: int("user_id").references(() => userTable.userID, {
		onDelete: "cascade",
	}),
	token: varchar("token", { length: 500 }).unique().notNull(),
	tokenExpiry: timestamp("token_expiry", { withTimezone: true }),
	ipAddress: varchar("ip_address", { length: 50 }),
	userAgent: varchar("user_agent", { length: 255 }),
	isValid: boolean("is_valid").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Store user Password Data
export const appDataTable = mysqlTable("app_data", {
	dataID: int("data_id").autoincrement().primaryKey(),
	userID: int("user_id").references(() => userTable.userID, {
		onDelete: "cascade",
	}),
	uuid: varchar("uuid", { length: 512 }).unique().notNull(),
	name: varchar("name", { length: 512 }),
	username: varchar("username", { length: 512 }),
	password: varchar("password", { length: 512 }),
	uri: json("uri"),
	favourite: boolean("favourite").default(false).notNull(),
	note: text("note"),
	trash: boolean("trash").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Relations
// userTable && userAuthTable && refreshTokenTable
export const userRelations = relations(userTable, ({ one, many }) => ({
	auth: one(userAuthTable, {
		fields: [userTable.userID],
		references: [userAuthTable.userID],
	}),
	token: many(refreshTokenTable), //foreign key
	login: many(appDataTable),
}));

// userTable && userAuthTable
export const userAuthRelations = relations(userAuthTable, ({ one }) => ({
	user: one(userTable, {
		fields: [userAuthTable.userID],
		references: [userTable.userID],
	}),
}));

// userTable && refreshTokenTable
export const refreshTokenRelations = relations(
	refreshTokenTable,
	({ one }) => ({
		user: one(userTable, {
			fields: [refreshTokenTable.userID],
			references: [userTable.userID],
		}),
	})
);

// userTable && loginTable
export const loginRelations = relations(appDataTable, ({ one }) => ({
	user: one(userTable, {
		fields: [appDataTable.userID],
		references: [userTable.userID],
	}),
}));
