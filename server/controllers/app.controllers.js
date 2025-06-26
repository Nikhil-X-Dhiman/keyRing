import {
	delPasswdByItemID,
	getAllPasswdById,
	insertPasswdById,
} from "../models/app.models.js";

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

	if (result.affectedRows === 0) {
		return res
			.status(404)
			.json({ success: false, msg: "Item Not Found or Failed to Remove!!!" });
	}
	return res.status(200).json({ success: true, msg: "Item Removed!!!" });
};
