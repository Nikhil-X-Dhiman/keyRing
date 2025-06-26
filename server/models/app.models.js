import { eq } from "drizzle-orm";
import { db } from "../drizzle/db/index.js";
import { loginTable } from "../drizzle/db/schema.js";

export const getAllPasswdById = async (id) => {
	try {
		return await db.select().from(loginTable).where(eq(loginTable.userID, id));
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const insertPasswdById = async (userID, item) => {
	try {
		const { name, user, passwd, uri, note, fav, trash, id } = item;
		return await db
			.insert(loginTable)
			.values({
				name: name,
				userID: userID,
				user: user,
				passwd: passwd,
				fav: fav,
				note: note,
				trash: trash,
				uri: uri,
				itemID: id,
			})
			.$returningId();
	} catch (error) {
		console.error(error);
		return null;
	}
};
