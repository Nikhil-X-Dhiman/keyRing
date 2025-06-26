import { and, eq } from "drizzle-orm";
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

export const delPasswdByItemID = async (itemID) => {
	try {
		return await db.delete(loginTable).where(eq(loginTable.itemID, itemID));
	} catch (error) {
		console.error("Delete Passwd: ", error);
		return null;
	}
};

export const delTrashPasswd = async (userID) => {
	try {
		return await db
			.delete(loginTable)
			.where(and(eq(loginTable.userID, userID), eq(loginTable.trash, true)));
	} catch (error) {
		console.error("Empty Trash Items: ", error);
		return null;
	}
};

export const markPasswdTrashByItemID = async (itemID, payload) => {
	console.log("inside mdoel: ", payload.trash, itemID);

	try {
		return await db
			.update(loginTable)
			.set({ trash: payload.trash })
			.where(eq(loginTable.itemID, itemID));
	} catch (error) {
		console.error("Mark Passwd Trash Error: ", error);
		return null;
	}
};

export const updatePasswdByItemID = async (itemID, payload) => {
	const { name, user, passwd, favourite, note, trash, uri } = payload;
	console.log("Favourite Value: ", payload);

	try {
		return await db
			.update(loginTable)
			.set({
				name: name,
				user: user,
				passwd: passwd,
				fav: favourite,
				note: note,
				trash: trash,
				uri: uri,
			})
			.where(eq(loginTable.itemID, itemID));
	} catch (error) {
		console.error("Editing Passwd Field Error: ", error);
		return null;
	}
};
