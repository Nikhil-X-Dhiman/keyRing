import path from "path";
import {
	getUserByCredentials,
	insertUserByCredential,
} from "../models/auth.models.js";
import { insertRefreshToken } from "../models/token.models.js";
import { jsonResponse } from "../services/jsonResponse.service.js";
import { genPasswdHash, verifyPasswd } from "../utils/handleArgon.js";
import {
	genAccessToken,
	genRefreshToken,
	verifyRefreshToken,
} from "../utils/handleTokens.js";
import { readFile } from "fs/promises";

export const handleLogin = async (req, res) => {
	// TODO: detect if user is already logged in
	const { email, passwd } = req.body;
	if (!email || !passwd) {
		return res.status(400).json(
			jsonResponse({
				isError: true,
				error: "Email or Password is required!!!",
			})
		);
	}
	let result;
	try {
		[result] = await getUserByCredentials(email, passwd);
		let passwdVerification = result
			? verifyPasswd(passwd, result?.auth?.passwordHash)
			: false;
		if (!passwdVerification || !result) {
			return res.status(404).json(
				jsonResponse({
					isError: true,
					error: "Email or Password is Incorrect",
				})
			);
		}
	} catch (error) {
		console.error("handleLogin: ", error);
	}
	const payload = {
		id: result?.users?.id,
		name: result?.users?.name,
		email: result?.users?.email,
		verified: result?.users?.emailVerified,
		role: result?.users?.role,
		plan: result?.users?.plan,
	};
	const accessToken = genAccessToken(payload);
	const refreshToken = genRefreshToken({ id: payload?.id });
	if (!accessToken || !refreshToken) {
		return res.status(500).json(
			jsonResponse({
				isError: true,
				error: "Access & Refresh token creation failed!!!",
			})
		);
	}
	// console.log("refresh token payload (handle login):", payload.id);

	await insertRefreshToken(refreshToken, payload?.id);

	res.cookie("refresh_token", refreshToken, {
		// 14 days (in miliseconds)
		maxAge: 1000 * 60 * 60 * 24 * 14,
		httpOnly: true,
	});

	return res.status(200).json(
		jsonResponse({
			isSuccess: true,
			data: { access_token: accessToken },
		})
	);
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
	let refreshToken = req.cookies.refresh_token;
	// verify & decode the refresh token
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
	console.log("Token Regeneration: New Access Token: ", payload);
	// TODO: Find out weather to send old refresh token again or not?
	res.status(201).json({ access_token: newAccessToken });
};
