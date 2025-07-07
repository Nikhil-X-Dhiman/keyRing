import e from "express";
import {
	handleGetMasterSalt,
	handleGetPublicKey,
	handleLogin,
	handleLogout,
	handleRefreshToken,
	handleRegister,
} from "../controllers/auth.controllers.js";

const router = e.Router();

router.route("/login").post(handleLogin);

router.route("/register").post(handleRegister);

router.route("/public").get(handleGetPublicKey);

router.route("/salt").post(handleGetMasterSalt);

router.route("/refresh").get(handleRefreshToken);

router.route("/logout").get(handleLogout);

export const authRouter = router;
