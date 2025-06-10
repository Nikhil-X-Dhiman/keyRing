import e from "express";
// import { jsonResponse } from "../services/jsonResponse.service.js";
import {
	handleGetPublicKey,
	handleLogin,
	handleRefreshToken,
	handleRegister,
} from "../controllers/auth.controllers.js";

const router = e.Router();

router.route("/login").post(handleLogin);

router.route("/register").post(handleRegister);

router.route("/public").get(handleGetPublicKey);

router.route("/refresh").post(handleRefreshToken);

export const authRouter = router;
