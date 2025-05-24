import { getUserByCredentials, getUserByID } from "../models/auth.models.js";
import {
	genAccessToken,
	genRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
} from "../utils/handleTokens.js";

export const authenticateUserRequest = async (req, res, next) => {
	// const accessToken = req.access_token;
	const authHeader = req.headers["authorization"];
	const accessToken = authHeader.split(" ")[1];
	const refreshToken = req.cookies.refresh_token;
	// console.log("Middleware access token: ", accessToken);
	// console.log("Middleware refresh token: ", refreshToken);

	if (!refreshToken) {
		req.user = null;
		next();
	} else if (accessToken) {
		req.user = verifyAccessToken(accessToken);
		next();
	} else if (refreshToken) {
		const decodedToken = verifyRefreshToken(refreshToken);
		const payload = getUserByID(decodedToken?.id);
		accessToken = genAccessToken(payload);
		refreshToken = genRefreshToken(decodedToken);
		// TODO: 1-> store & delete refresh in db 2-> make cookie and send to client 3-> make a response to client
	}
	next();
};
