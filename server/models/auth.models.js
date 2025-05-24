import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/db/index.js";
import { userAuthTable, userTable } from "../drizzle/db/schema.js";

export const getUserByCredentials = async (email, passwd) => {
	return await db
		.select()
		.from(userTable)
		.innerJoin(userAuthTable, eq(userTable.id, userAuthTable.userID))
		.where(eq(userTable.email, email));
};

export const insertUserByCredential = async (email, name, passwd) => {
	try {
		const [query1] = await db
			.insert(userTable)
			.values({ email, name })
			.$returningId();
		const [query2] = await db
			.insert(userAuthTable)
			.values({ userID: query1.id, passwordHash: passwd })
			.$returningId();

		return query2;
	} catch (error) {
		console.error("Register User Error: ", error);

		return false;
	}
};
