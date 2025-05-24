import { eq } from "drizzle-orm";
import { db } from "../drizzle/db/index.js";
import { refreshTokenTable, userTable } from "../drizzle/db/schema.js";

export const getRefreshToken = async (id) => {
	try {
		return await db
			.select()
			.from(refreshTokenTable)
			.innerJoin(userTable, eq(userTable.id, refreshTokenTable.userID))
			.where(eq(refreshTokenTable.userID, id));
	} catch (error) {
		console.error("Get Refresh Token Error: ", error);
		return false;
	}
};

export const insertRefreshToken = async (refreshToken, id) => {
	try {
		return await db
			.insert(refreshTokenTable)
			.values({ token: refreshToken, userID: id });
	} catch (error) {
		console.error("Insert Refresh Token Error: ", error);
		return null;
	}
};

export const removeRefreshToken = async (id) => {
	try {
		return await db
			.delete(refreshTokenTable)
			.where(eq(refreshTokenTable.userID, id));
	} catch (error) {
		console.error("Remove Refresh Token Error: ", error);
		return null;
	}
};
