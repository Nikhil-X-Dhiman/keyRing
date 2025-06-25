import {
	getUserByCredentials,
	insertUserByCredential,
} from "../models/auth.models.js";
import {
	insertRefreshToken,
	removeRefreshToken,
} from "../models/token.models.js";
import { jsonResponse } from "../services/jsonResponse.service.js";
import { genPasswdHash, verifyPasswd } from "../utils/handleArgon.js";
import {
	genAccessToken,
	genRefreshToken,
	verifyRefreshToken,
} from "../utils/handleTokens.js";
import { readFile } from "fs/promises";
import { emailSchema } from "../utils/handleSchema.js";
import { publicKey } from "../utils/handleCryptoKeys.js";

export const handleLogin = async (req, res) => {
	if (req.user) {
		// checks if user logged in
		return res
			.status(405)
			.json({ success: false, msg: "User Already Logged In!!!" });
	}
	const { email, passwd } = req.body;
	if (!email || !passwd) {
		// checks if email or password is present
		return res.status(400).json({
			success: false,
			msg: "Email or Password is required!!!",
		});
	}
	const { success, data } = emailSchema.safeParse(email);
	if (!success) {
		// checks if the format of the email is correct
		return res.status(400).json({
			success: false,
			msg: "Legal format of Email or Password is required!!!",
		});
	}

	let result;
	try {
		// get user details from db
		[result] = await getUserByCredentials(email, passwd);
		// compare passwd with its hash from db
		let passwdVerification = result
			? verifyPasswd(passwd, result?.auth?.passwordHash)
			: false;
		if (!passwdVerification || !result) {
			// no email found or passwd is incorrect
			return res
				.status(403)
				.json({ success: false, msg: "Email or Password is Incorrect!!!" });
		}
	} catch (error) {
		console.error("handleLogin: ", error);
		return res
			.status(400)
			.json({ success: false, msg: "Error Occured: Authentication" });
	}
	// payload created for access token
	const payload = {
		id: result?.users?.id,
		name: result?.users?.name,
		email: result?.users?.email,
		verified: result?.users?.emailVerified,
		role: result?.users?.role,
		plan: result?.users?.plan,
	};
	// create access token
	const accessToken = genAccessToken(payload);
	// create refresh token
	const refreshToken = genRefreshToken({ id: payload?.id });
	if (!accessToken || !refreshToken) {
		// check if access token & refresh token is created or not
		return res.status(500).json({
			success: false,
			msg: "Access or Refresh token creation failed!!!",
		});
	}
	// insert refresh token into db to track user session
	await insertRefreshToken(refreshToken, payload?.id);

	res.cookie("refresh_token", refreshToken, {
		// 14 days (in miliseconds)
		maxAge: 1000 * 60 * 60 * 24 * 14,
		httpOnly: true,
		secure: process.env.PRODUCTION,
	});
	// send the success response to login with access token & public key to verify it
	return res.status(200).json({
		success: true,
		access_token: accessToken,
		publicKey: publicKey,
		msg: "Log In Successful!!!",
	});
};

// Register by Creating a new User Account
export const handleRegister = async (req, res) => {
	const { email, name, passwd } = req.body;
	if (!email || !name || !passwd) {
		return res.status(400).json(
			jsonResponse({
				isError: true,
				error: "Email or Name or Password is Required!!!",
			})
		);
	}
	// Create hash from passwd
	const hashPasswd = await genPasswdHash(passwd);

	const result = await insertUserByCredential(email, name, hashPasswd);
	if (result) {
		return res
			.status(201)
			.json(jsonResponse({ isSuccess: true, data: "Success" }));
	}
	return res
		.status(409)
		.json(
			jsonResponse({ isError: true, error: "Email is Already Registered!!!" })
		);
};

export const handleGetPublicKey = async (req, res) => {
	let publicKey;
	try {
		publicKey = await readFile("../publicKey.pem", { encoding: "utf8" });
		return res.status(200).json({ publicKey: publicKey });
	} catch (error) {
		console.error("Server: Get Public Key to Client Error: ", error);
		return res.status(204).json({ error: "Public Key Error" });
	}
};

export const handleRefreshToken = async (req, res) => {
	let refreshToken = req.cookies?.refresh_token;
	// verify & decode the refresh token
	if (!refreshToken) {
		res
			.status(400)
			.json({ success: false, message: "No Refresh Token Received" });
	}
	const [decodedRefreshToken] = await verifyRefreshToken(refreshToken);
	if (!decodedRefreshToken) {
		console.log("Access Token Regeneration: Invalid Refresh Token");
		res.status(404).json({ error: "Invalid or Expired Token!!!" });
	}
	const payload = {
		id: decodedRefreshToken?.users?.id,
		name: decodedRefreshToken?.users?.name,
		email: decodedRefreshToken?.users?.email,
		verified: decodedRefreshToken?.users?.emailVerified,
		role: decodedRefreshToken?.users?.role,
		plan: decodedRefreshToken?.users?.plan,
	};
	const newAccessToken = genAccessToken(payload);
	const publicKey = await readFile("../publicKey.pem", { encoding: "utf8" });
	console.log("Token Regeneration: New Access Token: ", payload);
	// TODO: Find out weather to send old refresh token again or not?
	res.status(201).json({ access_token: newAccessToken, publicKey: publicKey });
};

export const handleLogout = async (req, res) => {
	const refreshToken = req.cookies.refresh_token;
	const [result] = await removeRefreshToken(refreshToken);
	console.log("Logout: ", result);
	// res.cookie("refresh_token", "", {
	// 	// 14 days (in miliseconds)
	// 	httpOnly: true,
	// });
	res.clearCookie("refresh_token", { httpOnly: true, path: "/" });
	res.status(200).json({ success: true, message: "User Logged Out" });
};
