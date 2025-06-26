import {
	delPasswdByItemID,
	delTrashPasswd,
	getAllPasswdById,
	insertPasswdById,
	markPasswdTrashByItemID,
	updatePasswdByItemID,
} from "../models/app.models.js";

export const handleConnectionCheck = (req, res) => {
	if (req.user) {
		// if user is logged in
		console.log("User Logged in: ", req.user);
		return res
			.status(200)
			.json({ success: true, msg: "Connection Success!!! User Logged In!!!" });
	}
	// when user is logged out
	console.log("User Logged Out!!!");
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
	const id = req.user.id;
	console.log(id);

	const result = await getAllPasswdById(id);
	console.log(result);
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
	const userID = req.user.id;
	const item = req.body;
	console.log("item: ", item);

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
	const { itemID } = req.params;
	console.log("ItemID: ", itemID);

	const [result] = await delPasswdByItemID(itemID);
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
	const userID = req.user.id;
	const [result] = await delTrashPasswd(userID);
	console.log("Trash Del: ", result);
	if (result?.affectedRows === 0) {
		return res.status(404).json({ success: false, msg: "Trash is Empty!!!" });
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
	const { itemID } = req.params;
	const payload = req.body;
	console.log("Trash Value: ", payload, itemID);
	const result = await markPasswdTrashByItemID(itemID, payload);
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
	const { itemID } = req.params;
	const payload = req.body;
	const result = await updatePasswdByItemID(itemID, payload);
	console.log("Result: ", result);
	if (!result) {
		return res.status(404).json({ success: false, msg: "Not Found!!!" });
	}
	return res.status(200).json({ success: true, msg: "Trash Value Changed!!!" });
};
