import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/db/index.js";
import { appDataTable } from "../drizzle/db/schema.js";

export const getAllPasswdById = async (userID) => {
	try {
		return await db
			.select({
				itemID: appDataTable.uuid,
				name: appDataTable.name,
				username: appDataTable.username,
				password: appDataTable.password,
				uri: appDataTable.uri,
				note: appDataTable.note,
				favourite: appDataTable.favourite,
				trash: appDataTable.trash,
				createdAt: appDataTable.createdAt,
				updatedAt: appDataTable.updatedAt,
			})
			.from(appDataTable)
			.where(eq(appDataTable.userID, userID));
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const insertPasswdById = async (userID, item) => {
	try {
		const { name, username, password, uri, note, favourite, trash, uuid } =
			item;
		return await db
			.insert(appDataTable)
			.values({
				name,
				userID,
				username,
				password,
				favourite,
				note,
				trash,
				uri,
				uuid,
			})
			.$returning();
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const delPasswdByItemID = async (uuid) => {
	try {
		return await db.delete(appDataTable).where(eq(appDataTable.uuid, uuid));
	} catch (error) {
		console.error("Delete Passwd: ", error);
		return null;
	}
};

export const delTrashPasswd = async (userID) => {
	try {
		return await db
			.delete(appDataTable)
			.where(
				and(eq(appDataTable.userID, userID), eq(appDataTable.trash, true))
			);
	} catch (error) {
		console.error("Empty Trash Items: ", error);
		return null;
	}
};

export const markPasswdTrashByItemID = async (uuid, payload) => {
	// console.log("inside mdoel: ", payload.trash, uuid);

	try {
		return await db
			.update(appDataTable)
			.set({ trash: payload.trash })
			.where(eq(appDataTable.uuid, uuid));
	} catch (error) {
		console.error("Mark Passwd Trash Error: ", error);
		return null;
	}
};

export const updatePasswdByItemUUID = async (uuid, payload) => {
	const { name, username, password, favourite, note, trash, uri } = payload;

	try {
		return await db
			.update(appDataTable)
			.set({
				name,
				username,
				password,
				favourite,
				note,
				trash,
				uri,
			})
			.where(eq(appDataTable.uuid, uuid));
	} catch (error) {
		console.error("Editing Password Field Error: ", error);
		return null;
	}
};
