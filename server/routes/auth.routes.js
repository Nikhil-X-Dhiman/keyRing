import e from "express";
import { jsonResponse } from "../services/jsonResponse.service.js";
import {
	handleLogin,
	handleRegister,
} from "../controllers/auth.controllers.js";

const router = e.Router();

router.route("/login").post(handleLogin);

router.route("/register").post(handleRegister);

export const authRouter = router;
