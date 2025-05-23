import e from "express";
import { jsonResponse } from "../services/jsonResponse.service.js";
import {
	handleLogin,
	handleRegister,
} from "../controllers/auth.controllers.js";

const router = e.Router();

router.route("/check").get((req, res) => {
	// req.user = { name: "nikhil" };
	if (req?.user) {
		return res.json(jsonResponse({ isSuccess: true, data: "User Logged In" }));
	}
	return res.json(jsonResponse({ isError: true, error: "No User Logged In" }));
});

router.route("/login").post(handleLogin);
router.route("/register").post(handleRegister);

export const authRouter = router;
