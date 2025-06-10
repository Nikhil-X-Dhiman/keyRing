import {
	insertRefreshToken,
	removeRefreshToken,
} from "../models/token.models.js";
import { jsonResponse } from "../services/jsonResponse.service.js";
import {
	genAccessToken,
	genRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
} from "../utils/handleTokens.js";

export const authenticateUserRequest = async (req, res, next) => {
	// const accessToken = req.access_token;
	const authHeader = req.headers["authorization"];
	const accessToken = authHeader?.split(" ")[1];
	// const refreshToken = req.cookies.refresh_token;
	// console.log("Middleware access token: ", accessToken);
	// console.log("Middleware refresh token: ", refreshToken);
	console.log("verify: inside middleware");

	if (!accessToken) {
		req.user = null;
		return next();
	}
	if (accessToken) {
		const decodedAccessToken = verifyAccessToken(accessToken);
		if (decodedAccessToken) {
			console.log("Access Token is Valid!!!");

			req.user = decodedAccessToken;
			return next();
		} else {
			res.send(403).json("Auth: Token Expired!!!");
		}
		console.log("Access Token is Invalid!!!");
	}

	// if (refreshToken) {
	// 	console.log("verify: inside refresh token");
	// 	// TODO: Support for multi session per user, as only one token per userID is supported for now
	// 	const [decodedToken] = await verifyRefreshToken(refreshToken);
	// 	if (!decodedToken) {
	// 		console.log("Refresh Token is Invalid!!!");
	// 		return res.status(403).json(
	// 			jsonResponse({
	// 				isError: true,
	// 				error:
	// 					"Protected Route: Authorization Required(Invalid Refresh Token)",
	// 			})
	// 		);
	// 	}
	// 	console.log("Refresh Token is Valid");

	// 	const payload = {
	// 		id: decodedToken?.users?.id,
	// 		name: decodedToken?.users?.name,
	// 		email: decodedToken?.users?.email,
	// 		verified: decodedToken?.users?.emailVerified,
	// 		role: decodedToken?.users?.role,
	// 		plan: decodedToken?.users?.plan,
	// 	};
	// 	req.user = payload;

	// 	const newAccessToken = genAccessToken(payload);
	// 	console.log("access token: ", newAccessToken);
	// 	const newRefreshToken = genRefreshToken({
	// 		id: decodedToken?.users?.id,
	// 	});
	// 	// console.log("new refresh token: ", newRefreshToken);
	// 	await removeRefreshToken(decodedToken?.refresh_token?.token);
	// 	await insertRefreshToken(newRefreshToken, payload?.id);
	// 	res.cookie("refresh_token", refreshToken, {
	// 		maxAge: 1000 * 60 * 60 * 24 * 14,
	// 		httpOnly: true,
	// 	});
	// 	res.setHeader("Authorization", `Bearer ${newAccessToken}`);
	// 	req.newToken = newAccessToken;
	// 	return next();
	// }

	console.log("No Valid Access & Refresh Token Found");
	req.user = null;
	return next();
};
