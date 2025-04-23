import { mysqlTable, serial, varchar, timestamp, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(), // Auto-incrementing primary key
  name: varchar('name', { length: 255 }).notNull(),
  age: int().notNull(),
  username: varchar({length: 255}).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().$onUpdate(() => new Date()),
});
