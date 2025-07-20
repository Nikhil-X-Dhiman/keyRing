import {
	delPasswdByItemID,
	delTrashPasswd,
	getAllPasswdById,
	insertPasswdById,
	markPasswdTrashByItemID,
	updatePasswdByItemUUID,
} from "../models/app.models.js";

export const handleConnectionCheck = (req, res) => {
	if (req.user) {
		// if user is logged in
		console.log("User Logged in: ", req.user);
		return res
			.status(200)
			.json({ success: true, msg: "Connection Success!!! User Logged In!!!" });
	}
	return res
		.status(200)
		.json({ success: true, msg: "Connection Success!!! User Logged Out!!!" });
};

export const handleAllDataRetrieval = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({
			success: false,
			msg: "Access is Denied...Authentication Required!!!",
		});
	}
	const userID = req.user.userID;
	// console.log(id);

	const result = await getAllPasswdById(userID);
	// console.log(result);
	return res
		.status(200)
		.json({ success: true, msg: "All Data Retrieved", result: result });
};

export const handleAddItem = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({
			success: false,
			msg: "Access is Denied...Authentication Required!!!",
		});
	}
	const userID = req.user.userID;
	const item = req.body;
	// console.log("item: ", item);

	const result = await insertPasswdById(userID, item);
	console.log(result);
	return res
		.status(201)
		.json({ success: true, msg: "Inserted Item", data: result });
};

export const handleDeleteItem = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({
			success: false,
			msg: "Access is Denied...Authentication Required!!!",
		});
	}
	const { uuid } = req.params;
	console.log("UUID: ", uuid);

	const [result] = await delPasswdByItemID(uuid);
	console.log("Delete DB Result: ", result.affectedRows);

	if (result?.affectedRows === 0) {
		return res
			.status(404)
			.json({ success: false, msg: "Item Not Found or Failed to Remove!!!" });
	}
	return res.status(200).json({ success: true, msg: "Item Removed!!!" });
};

export const handleEmptyTrash = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({
			success: false,
			msg: "Access is Denied...Authentication Required!!!",
		});
	}
	const userID = req.user.userID;
	const [result] = await delTrashPasswd(userID);
	// console.log("Trash Del: ", result);
	if (result?.affectedRows === 0) {
		return res
			.status(404)
			.json({ success: false, msg: "Trash is not Empty!!!" });
	}
	return res.status(200).json({ success: true, msg: "Trash is now empty!!!" });
};

export const handleMarkTrash = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({
			success: false,
			msg: "Access is Denied...Authentication Required!!!",
		});
	}
	const { uuid } = req.params;
	const payload = req.body;
	console.log("Trash Value: ", payload, uuid);
	const result = await markPasswdTrashByItemID(uuid, payload);
	console.log("Result: ", result);
	if (!result) {
		return res.status(404).json({ success: false, msg: "Not Found!!!" });
	}
	return res.status(200).json({ success: true, msg: "Trash Value Changed!!!" });
};

export const handleEditItem = async (req, res) => {
	if (!req.user) {
		return res.status(403).json({
			success: false,
			msg: "Access is Denied...Authentication Required!!!",
		});
	}
	const { uuid } = req.params;
	const payload = req.body;
	const result = await updatePasswdByItemUUID(uuid, payload);
	console.log("Result: ", result);
	if (!result) {
		return res.status(404).json({ success: false, msg: "Not Found!!!" });
	}
	return res.status(200).json({ success: true, msg: "Trash Value Changed!!!" });
};
