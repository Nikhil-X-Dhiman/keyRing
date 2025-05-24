import {
	getUserByCredentials,
	insertUserByCredential,
} from "../models/auth.models.js";
import { jsonResponse } from "../services/jsonResponse.service.js";
import { genPasswdHash, verifyPasswd } from "../utils/handleArgon.js";

export const handleLogin = async (req, res) => {
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

	return res.status(200).json(
		jsonResponse({
			isSuccess: true,
			data: {
				id: result.users.id,
				name: result.users.name,
				email: result.users.email,
				verified: result.users.emailVerified,
				role: result.users.role,
				plan: result.users.plan,
			},
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
		.status(500)
		.json(
			jsonResponse({ isError: true, error: "Email is Already Registered!!!" })
		);
};
