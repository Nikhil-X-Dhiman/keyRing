import { relations } from "drizzle-orm";
import { boolean, integer, text } from "drizzle-orm/gel-core";
import {
  mysqlTable,
  serial,
  varchar,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const auth = mysqlTable("auth", {
  id: int("id").autoincrement().primaryKey(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("update_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
  userID: int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const session = mysqlTable("session", {
  id: int("id").autoincrement().primaryKey(),
  valid: boolean().default(true).notNull(),
  userAgent: text("user_agent"),
  ip: varchar({ length: 255 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
  userID: int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const passwdStorage = mysqlTable("passwdStorage", {
  id: int("id").autoincrement().primaryKey(),
  serviceName: varchar("service_name", { length: 255 }),
  username: varchar({ length: 255 }),
  password: varchar({ length: 255 }),
  website: varchar({ length: 255 }),
  uri: varchar({ length: 255 }),
  userID: int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

// Relation
export const authRelation = relations(auth, ({ one }) => ({
  user: one(users, {
    fields: [auth.userID], //foreign key
    references: [users.id],
  }),
}));

export const sessionRelation = relations(session, ({ one }) => ({
  user: one(users, {
    fields: [session.userID], //foreign key
    references: [users.id],
  }),
}));

export const usersRelation = relations(users, ({ many }) => ({
  passwd: many(passwdStorage),
  sessions: many(session),
}));

export const passwdRelation = relations(passwdStorage, ({ one }) => ({
  user: one(users, {
    fields: [passwdStorage.userID], //foreign key
    references: [users.id],
  }),
}));
