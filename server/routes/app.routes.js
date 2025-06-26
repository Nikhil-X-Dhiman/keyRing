import e from "express";
import {
	handleAddItem,
	handleAllDataRetrieval,
} from "../controllers/app.controllers.js";

const router = e.Router();

router.route("/connect").get((req, res) => {
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
});

router.route("/all").get(handleAllDataRetrieval);

router.route("/item").post(handleAddItem);

export const appRouter = router;
