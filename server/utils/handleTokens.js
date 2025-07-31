import jwt from "jsonwebtoken";
// import { readFileSync } from "fs";
import { getRefreshToken } from "../models/token.models.js";
import { privateKey, publicKey } from "./handleCryptoKeys.js";
import { log } from "console";

// const publicKey = readFileSync("../publicKey.pem", { encoding: "utf-8" });
// const privateKey = readFileSync("../privateKey.pem", { encoding: "utf-8" });

export const genAccessToken = (payload) => {
	try {
		const accessToken = jwt.sign(payload, privateKey, {
			algorithm: "RS256",
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // 15 minutes
			// expiresIn: 60 * 15, // in seconds
		});
		return accessToken;
	} catch (error) {
		console.error("Generate Access Token Error: ", error);
		return null;
	}
};

export const verifyAccessToken = (accessToken) => {
	try {
		const decodedToken = jwt.verify(accessToken, publicKey);
		return decodedToken;
	} catch (error) {
		console.error("Verify Token Error: ", error);
		return null;
	}
};

export const genRefreshToken = (payload) => {
	try {
		const refreshToken = jwt.sign(payload, privateKey, {
			algorithm: "RS256",
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // 14 days
			// expiresIn: 60 * 60 * 24 * 14, // 14 days
		});
		return refreshToken;
	} catch (error) {
		console.error("Generate Refresh Token Error: ", error);
		return null;
	}
};

export const verifyRefreshToken = async (refreshToken) => {
	try {
		const decodedToken = jwt.verify(refreshToken, publicKey);
		console.log("**handleTokens->DecodedToken: ", decodedToken);
		const foundRefreshToken = await getRefreshToken(decodedToken.userID);
		return foundRefreshToken;
	} catch (error) {
		console.error("Verify Refresh Token Error: ", error);
		return null;
	}
};
