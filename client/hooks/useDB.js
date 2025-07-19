// Importing dexie db instance

import { db } from "../db/db";

export const useDB = () => {
	const fetchAllItems = async () => {
		// set start loading
		try {
			const passwdList = await db.passwdList.toArray();
			// set stop loading
			return passwdList;
		} catch (error) {
			console.error("Failed to load data: ", error);
			throw new Error("Failed to load data");
		}
	};
	const handleAddItem = async (item) => {
		// e.preventDefault();
		console.log("RUNNING");

		if (!item) {
			console.error("Item cannot be empty");
			throw new Error("No Data to Store");
		}
		try {
			const id = await db.passwdList.add({
				...item,
				password: item.passwd, // Map passwd to password to match schema
				created_at: new Date(),
				updated_at: new Date(),
			});
			console.log("Item Added with ID: ", id);
			return id;
			// TODO: here fetch or upload the item to cloud
		} catch (error) {
			console.error("Failed to Add Item: ", error);
			throw new Error("Failed to Add Item");
		}
	};
	const handleToggleFav = async (id, currentValue) => {
		try {
			const success = await db.passwdList.update(id, {
				favourite: !currentValue,
				updated_at: new Date(),
			});
			if (success) {
				console.log("Item is now Favourite");
				return success;
			} else {
				console.error("Item Not Found");
				throw new Error("Item Not Found");
			}
		} catch (error) {
			console.error("Failed to Update Item: ", error);
			throw new Error("Item not updated or not found");
		}
	};

	const handleToggleTrash = async (id, currentValue) => {
		try {
			const success = await db.passwdList.update(id, {
				trash: !currentValue,
				updated_at: new Date(),
			});
			if (success) {
				console.log("Item is now in Trash");
				return true;
			} else {
				console.error("Item Not Found");
				throw new Error("Item Not Found");
			}
		} catch (error) {
			console.error("Failed to put Item in Trash: ", error);
			throw new Error("Item not trashed or not found");
		}
	};

	const handleDeleteItem = async (id) => {
		try {
			await db.passwdList.delete(id);
			console.log("Item is deleted");
			return true;
		} catch (error) {
			console.error("Failed to Delete Item", error);
			throw new Error("Failed to Delete Item");
		}
	};

	const handleGetItemByID = async (id) => {
		try {
			const item = await db.passwdList.get(id);
			console.log("Item is Found");
			if (item) {
				return item;
			} else {
				console.error("Item Not Found");
				throw new Error("Item Not Found");
			}
		} catch (error) {
			console.error("Failed to get Item by ID");
			throw new Error(error);
		}
	};

	const handleEmptyTrash = async () => {
		try {
			await db.transaction("rw", db.passwdList, async () => {
				const keysList = await db.passwdList
					.where("trash")
					.equals(true)
					.primaryKeys(); // only get primary Keys for efficiency
				await db.passwdList.bulkDelete(keysList);
			});
			console.log("Trash is now Empty");
			return true;
		} catch (error) {
			console.error("Error Emptying the Trash", error);
			throw new Error("Error Emptying the Trash");
		}
	};

	const handleEmptyList = async () => {
		try {
			await db.passwdList.clear();
			console.log("List is now Empty");
			return true;
		} catch (error) {
			console.error("Failed to clear list", error);
			throw new Error("Failed to Clear List");
		}
	};

	return {
		fetchAllItems,
		handleAddItem,
		handleDeleteItem,
		handleEmptyList,
		handleEmptyTrash,
		handleGetItemByID,
		handleToggleFav,
		handleToggleTrash,
	};
};
