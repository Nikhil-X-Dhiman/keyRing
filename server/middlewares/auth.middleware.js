import { verifyAccessToken } from "../utils/handleTokens.js";

export const authenticateUserRequest = async (req, res, next) => {
	//extract auth header & get the access token
	const authHeader = req.headers["authorization"];
	const accessToken = authHeader?.split(" ")[1];
	console.log("Access Token: ", accessToken);

	if (!accessToken) {
		// access token is not present
		req.user = null;
		return next();
	} else if (accessToken) {
		const decodedAccessToken = verifyAccessToken(accessToken);
		if (decodedAccessToken) {
			// verified access token
			req.user = decodedAccessToken;
			return next();
		} else {
			// if access token expired & route is to refresh access token
			if (req.path.includes("/refresh")) {
				req.user = null;
			} else {
				// access token expired or illegal
				return res.status(403).json({ msg: "Auth: Token Expired!!!" });
			}
		}
	}

	req.user = null;
	return next();
};
