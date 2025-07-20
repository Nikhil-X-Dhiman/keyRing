import { eq } from "drizzle-orm";
import { db } from "../drizzle/db/index.js";
import { refreshTokenTable, userTable } from "../drizzle/db/schema.js";

export const getRefreshToken = async (userID) => {
	try {
		return await db
			.select()
			.from(refreshTokenTable)
			.innerJoin(userTable, eq(userTable.userID, refreshTokenTable.userID))
			.where(eq(refreshTokenTable.userID, userID));
	} catch (error) {
		console.error("Get Refresh Token Error: ", error);
		return false;
	}
};

export const insertRefreshToken = async (refreshToken, userID) => {
	try {
		return await db
			.insert(refreshTokenTable)
			.values({ token: refreshToken, userID });
	} catch (error) {
		console.error("Insert Refresh Token Error: ", error);
		return null;
	}
};

export const removeRefreshToken = async (token) => {
	try {
		return await db
			.delete(refreshTokenTable)
			.where(eq(refreshTokenTable.token, token));
	} catch (error) {
		console.error("Remove Refresh Token Error: ", error);
		return null;
	}
};
