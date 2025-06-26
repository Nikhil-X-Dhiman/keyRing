import { relations } from "drizzle-orm";
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
	id: int("id").autoincrement().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	role: mysqlEnum("role", ["admin", "customer"]).default("customer").notNull(),
	plan: mysqlEnum("plan", ["free", "plus", "pro"]).default("free").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	failedLoginAttempts: int("failed_login_attempts").default(0).notNull(),
	lastLogin: datetime("last_login"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updateAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => sql`now()`)
		.notNull(),
});

// Track user Auth details
export const userAuthTable = mysqlTable("auth", {
	id: int("id").autoincrement().primaryKey(),
	userID: int("user_id").references(() => userTable.id, {
		onDelete: "cascade",
	}),
	passwordHash: varchar("password_hash", { length: 255 }).unique().notNull(),
	verifyToken: varchar("verify_token", { length: 255 }).unique(),
	verifyTokenExpiry: timestamp("verify_token_expiry", {
		withTimezone: true,
	}),
	resetPasswordToken: varchar("reset_password_token", { length: 255 }).unique(),
	resetPasswordTokenExpiry: timestamp("reset_password_token_expiry", {
		withTimezone: true,
	}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updateAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => sql`now()`)
		.notNull(),
});

// Track user Session Details
export const refreshTokenTable = mysqlTable("refresh_token", {
	id: int("id").autoincrement().primaryKey(),
	userID: int("user_id").references(() => userTable.id, {
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
	updateAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => sql`now()`)
		.notNull(),
});

// Store user Password Data
export const loginTable = mysqlTable("login", {
	id: int("id").autoincrement().primaryKey(),
	userID: int("user_id").references(() => userTable.id, {
		onDelete: "cascade",
	}),
	itemID: varchar("item_id", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }),
	user: varchar("username", { length: 255 }),
	passwd: varchar("password", { length: 255 }),
	uri: json("uri"),
	fav: boolean("favorite").default(false).notNull(),
	note: text("note"),
	trash: boolean("trash").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updateAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => sql`now()`)
		.notNull(),
});

// Relations
// userTable && userAuthTable && refreshTokenTable
export const userRelations = relations(userTable, ({ one, many }) => ({
	auth: one(userAuthTable, {
		fields: [userTable.id],
		references: [userAuthTable.userID],
	}),
	token: many(refreshTokenTable), //foreign key
	login: many(loginTable),
}));

// userTable && userAuthTable
export const userAuthRelations = relations(userAuthTable, ({ one }) => ({
	user: one(userTable, {
		fields: [userAuthTable.userID],
		references: [userTable.id],
	}),
}));

// userTable && refreshTokenTable
export const refreshTokenRelations = relations(
	refreshTokenTable,
	({ one }) => ({
		user: one(userTable, {
			fields: [refreshTokenTable.userID],
			references: [userTable.id],
		}),
	})
);

// userTable && loginTable
export const loginRelations = relations(loginTable, ({ one }) => ({
	user: one(userTable, {
		fields: [loginTable.userID],
		references: [userTable.id],
	}),
}));
