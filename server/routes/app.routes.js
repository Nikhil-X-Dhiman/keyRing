import e from "express";
import { jsonResponse } from "../services/jsonResponse.service.js";

const router = e.Router();

router.route("/connect").get((req, res) => {
	if (req.user) {
		// if user is logged in
		console.log("User Logged in: ", req.user);
		res
			.status(200)
			.json({ success: true, msg: "Connection Success!!! User Logged In!!!" });
	}
	// when user is logged out
	console.log("User Logged Out!!!");
	res
		.status(200)
		.json({ success: true, msg: "Connection Success!!! User Logged Out!!!" });
});

export const appRouter = router;
