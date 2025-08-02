// Importing dexie db instance

import { useCallback } from "react";
import { db } from "../db/db";

function reformItem(item) {
	const {
		uuid,
		name,
		username,
		password,
		uri,
		note,
		favourite,
		trash,
		createdAt: created_at,
		updatedAt: updated_at,
	} = item;
	return {
		uuid,
		name,
		username,
		password,
		uri,
		note,
		favourite,
		trash,
		created_at,
		updated_at,
	};
}

export const useDB = () => {
	const fetchAllItemsDB = async () => {
		// set start loading
		try {
			const passwdList = await db.passwdList.toArray();
			// set stop loading
			return passwdList;
		} catch (error) {
			console.error("Failed to load data: ", error);
			return [];
			// throw new Error("Failed to load data");
		}
	};

	const handleAddItemDB = async (item) => {
		if (!item) {
			console.error("Item cannot be empty");
			throw new Error("No Data to Store");
		}
		try {
			const {
				uuid,
				name,
				username,
				password,
				uri,
				note,
				favourite,
				trash,
				createdAt = new Date().toUTCString(),
				updatedAt = new Date().toUTCString(),
			} = item;
			const id = await db.passwdList.put({
				uuid,
				name,
				username,
				password,
				uri,
				note,
				favourite,
				trash,
				created_at: createdAt,
				updated_at: updatedAt,
			});
			console.log("Item Added with ID: ", id);
			return id;
		} catch (error) {
			console.error("Failed to Add Item: ", error);
			throw new Error("Failed to Add Item");
		}
	};
	const handleEditItemDB = async (item) => {
		try {
			const success = await db.passwdList.put({ ...reformItem(item) });
			return success;
		} catch (error) {
			console.error("useDB: Saving Edit Item Failed: ", error);
			return false;
		}
	};
	const handleBulkAddItemsDB = async (itemList) => {
		try {
			await db.passwdList.bulkAdd(itemList);
			return true;
		} catch (error) {
			console.error("Bulk Add to DB Failed: ", error);
			throw new Error("Bulk Add to DB Failed");
		}
	};
	const handleToggleFavDB = async (uuid, currentValue) => {
		try {
			const success = await db.passwdList.update(uuid, {
				favourite: !currentValue,
				updated_at: new Date().toISOString(),
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

	const handleToggleTrashDB = async (uuid, currentValue) => {
		console.log("useDB: UUID of item: ", uuid);

		try {
			const success = await db.passwdList.update(uuid, {
				trash: !currentValue,
				updated_at: new Date().toISOString(),
			});
			console.log("useDB: Success Value: ", success);

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

	const handleDeleteItemDB = async (uuid) => {
		try {
			await db.passwdList.delete(uuid);
			console.log("Item is deleted");
			return true;
		} catch (error) {
			console.error("Failed to Delete Item", error);
			throw new Error("Failed to Delete Item");
		}
	};

	const handleGetItemByIdDB = async (id) => {
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

	const handleEmptyTrashDB = async () => {
		try {
			console.log("useDB: handleEmptyTrash: Empty Trash running!!! ");
			await db.passwdList.filter((item) => item.trash === true).delete();
			// using filter is inefficient, so next time store true -> 1 && false -> 0 & use "db.passwd.where("trash").equals(1).delete()"

			console.log("Trash is now Empty");
			return true;
		} catch (error) {
			console.error("Error Emptying the Trash", error);
			throw new Error("Error Emptying the Trash");
		}
	};

	const handleEmptyListDB = async () => {
		try {
			await db.passwdList.clear();
			console.log("List is now Empty");
			return true;
		} catch (error) {
			console.error("Failed to clear list", error);
			throw new Error("Failed to Clear List");
		}
	};

	const handleAddAppState = async (userState) => {
		try {
			await db.appState.add({ ...userState, id: 1 });
			return true;
		} catch (error) {
			console.error("Failed to add user state to loacl DB: ", error);
			throw new Error("Failed to add user state to DB");
		}
	};

	const handleFetchFullAppState = async () => {
		try {
			const userState = await db.appState.get(1);
			return userState;
		} catch (error) {
			console.error("Failed to fetch user state: ", error);
			return null;
		}
	};

	const handleInitializeAppState = async () => {
		try {
			await db.appState.put({
				id: 1,
				user: null,
				master_salt: "",
				access_token: "",
				public_key: "",
				persist: false,
			});
			console.log("DB: App State Default Initialization Success");
		} catch (error) {
			console.error("DB: AppState Initialization Failed: ", error);
			return false;
		}
	};

	const handleLoginUpdateAppState = useCallback(async (state) => {
		try {
			const success = await db.appState.update(1, {
				user: state.user,
				master_salt: state.master_salt,
				access_token: state.access_token,
				public_key: state.public_key,
				persist: state.persist,
			});
			if (success) {
				console.log("DB: App State update with Curr User State");
				return success;
			}
		} catch (error) {
			console.error("DB: App State is not updated upon login: ", error);
			return false;
		}
	}, []);

	const handleUpdateAppState = async (field, value) => {
		try {
			const success = await db.appState.update(1, {
				[field]: value,
			});
			if (success) {
				console.log(`Field: ${field} is updated with value: ${value}`);
				return true;
			}
		} catch (error) {
			console.error("Updating Field " + field + " failed: ", error);
		}
	};

	const handleFullEmptyAppState = async () => {
		try {
			await db.appState.clear();
			console.log("App State is now Deleted");
		} catch (error) {
			console.error("User State Deletion Not Completed: ", error);
			throw new Error("User State Deletion Not Completed");
		}
	};

	const handlePersistEmptyAppState = async () => {
		try {
			await db.appState.update(1, {
				user: null,
				master_salt: "",
				access_token: "",
			});
		} catch (error) {
			console.error("LogOut: Persist Assisted Logout: ", error);
		}
	};

	const handleDelDB = async () => {
		try {
			await db.delete();
			console.log("Local DB Deleted");
			return true;
		} catch (error) {
			console.error("DB cannot be deleted: ", error);
			throw new Error("DB Deletion Error");
		}
	};

	const handleDBOpen = useCallback(async () => {
		try {
			await db.open();
			console.log("Local DB is now available");
		} catch (error) {
			console.error("DB cannot be initialized: ", error);
			throw new Error("DB cannot be initialized");
		}
	}, []);

	const handleAddNewAccessTokenDB = async (accessToken) => {
		try {
			await db.appState.update(1, {
				access_token: accessToken,
			});
			return true;
		} catch (error) {
			console.error("New Token Addition Failed: ", error);
			throw new Error("New Token Addition Failed");
		}
	};

	const handleFetchAppStateDB = async (field) => {
		try {
			const appState = await db.appState.get(1);
			return appState?.[field] ?? null;
		} catch (error) {
			console.error(`Error fetching field "${field}" from appState:`, error);
			throw new Error("Fetching from LocalDB Failed");
		}
	};

	return {
		fetchAllItemsDB,
		handleAddItemDB,
		handleEditItemDB,
		handleDeleteItemDB,
		handleEmptyListDB,
		handleEmptyTrashDB,
		handleGetItemByIdDB,
		handleToggleFavDB,
		handleToggleTrashDB,
		handleBulkAddItemsDB,
		handleAddAppState,
		handleFullEmptyAppState,
		handleFetchFullAppState,
		handleDelDB,
		handleDBOpen,
		handleAddNewAccessTokenDB,
		handleFetchAppStateDB,
		handleUpdateAppState,
		handleLoginUpdateAppState,
		handleInitializeAppState,
		handlePersistEmptyAppState,
	};
};
