import {
	getUserByCredentials,
	insertUserByCredential,
} from "../models/auth.models.js";
import { jsonResponse } from "../services/jsonResponse.service.js";

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
	const [result] = await getUserByCredentials(email, passwd);
	// console.log("result", result);
	if (!result) {
		return res
			.status(404)
			.json(
				jsonResponse({ isError: true, error: "Email or Password is Incorrect" })
			);
	}
	return res.status(200).json(
		jsonResponse({
			isSuccess: true,
			data: {
				id: result.id,
				name: result.name,
				email: result.email,
				verified: result.emailVerified,
				role: result.role,
				plan: result.plan,
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
	const result = await insertUserByCredential(email, name, passwd);
	if (result) {
		return res
			.status(201)
			.json(jsonResponse({ isSuccess: true, data: "Success" }));
	}
	return res
		.status(500)
		.json(
			jsonResponse({ isError: true, error: "Server: User Creation Failed!!!" })
		);
};
