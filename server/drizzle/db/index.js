import { drizzle } from "drizzle-orm/mysql2";

// connect db with drizzle
export const db = drizzle(process.env.DATABASE_URL);
