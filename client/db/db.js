import Dexie from "dexie";

export const db = new Dexie("keyRingDB");
db.version(1).stores({
	passwdList:
		"++id, &itemID, name, user, password, uri, note, favourite, trash, created_at, updated_at",
	appState:
		"id, &email, user, &master_salt, access_token, public_key, login_status",
	protectedState: "++id, passwd_hash, hash_salt ",
});

// Before opening your database
Dexie.debug = true; // Set to false for production
