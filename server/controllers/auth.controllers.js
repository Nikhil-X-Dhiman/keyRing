import {
	getUserByCredentials,
	insertUserByCredential,
} from "../models/auth.models.js";
import { insertRefreshToken } from "../models/token.models.js";
import { jsonResponse } from "../services/jsonResponse.service.js";
import { genPasswdHash, verifyPasswd } from "../utils/handleArgon.js";
import { genAccessToken, genRefreshToken } from "../utils/handleTokens.js";

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
