import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/db/index.js";
import { userAuthTable, userTable } from "../drizzle/db/schema.js";

export const getUserByCredentials = async (email, passwd) => {
	return await db
		.select()
		.from(userTable)
		.innerJoin(userAuthTable, eq(userTable.id, userAuthTable.userID))
		.where(
			and(eq(userTable.email, email), eq(userAuthTable.passwordHash, passwd))
		);
};

export const insertUserByCredential = async (email, name, passwd) => {
	try {
		const [query1] = await db
			.insert(userTable)
			.values({ email, name })
			.$returningId();
		const [query2] = await db
			.insert(userAuthTable)
			.values({ userID: query1.id, passwordHash: passwd });
		return true;
	} catch (error) {
		return false;
	}
};
