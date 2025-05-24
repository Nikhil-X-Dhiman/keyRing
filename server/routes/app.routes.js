import e from "express";
import { jsonResponse } from "../services/jsonResponse.service.js";

const router = e.Router();

router.route("/connect").get((req, res) => {
	if (req.user) {
		console.log("User Logged in: ", req.user);
		return res
			.status(200)
			.json(jsonResponse({ isSuccess: true, data: "User is Logged In!!!" }));
	}
	console.log("User Logged Out!!!");
	return res
		.status(404)
		.json(jsonResponse({ isError: true, error: "User is logged out!!!" }));
});

export const appRouter = router;
