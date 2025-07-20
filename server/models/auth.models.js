import { eq } from "drizzle-orm";
import { db } from "../drizzle/db/index.js";
import { userAuthTable, userTable } from "../drizzle/db/schema.js";

export const getUserByCredentials = async (email) => {
	// get user table & userAuth table details simultaneously
	try {
		return await db
			.select()
			.from(userTable)
			.innerJoin(userAuthTable, eq(userTable.userID, userAuthTable.userID))
			.where(eq(userTable.email, email));
	} catch (error) {
		console.error("Get User By Credentials: ", error);
		return null;
	}
};

export const getUserByID = async (userID) => {
	try {
		return await db
			.select()
			.from(userTable)
			.where(eq(userTable.userID, userID));
	} catch (error) {
		console.error("Get User By ID Error: ", error);
		return null;
	}
};

export const insertUserByCredential = async (
	email,
	username,
	password,
	salt
) => {
	try {
		// insert email & name to user table
		const [query1] = await db
			.insert(userTable)
			.values({ email, username })
			.$returningId();
		// insert passwd hash into user auth table and primary key from prev. insertion from query 1
		const [query2] = await db
			.insert(userAuthTable)
			.values({ userID: query1, passwordHash: password, salt })
			.$returningId();

		return query2;
	} catch (error) {
		console.error("Register User Error: ", error);
		return false;
	}
};
