import {
	getUserByCredentials,
	insertUserByCredential,
} from "../models/auth.models.js";
import {
	insertRefreshToken,
	removeRefreshToken,
} from "../models/token.models.js";
import { genPasswdHash, verifyPasswd } from "../utils/handleArgon.js";
import {
	genAccessToken,
	genRefreshToken,
	verifyRefreshToken,
} from "../utils/handleTokens.js";
import {
	emailSchema,
	nameSchema,
	passwdSchema,
} from "../utils/handleSchema.js";
import { publicKey } from "../utils/handleCryptoKeys.js";
import { log } from "console";

export const handleLogin = async (req, res) => {
	if (req.user) {
		// checks if user logged in
		return res
			.status(405)
			.json({ success: false, msg: "User Already Logged In!!!" });
	}
	const { email, password } = req.body;
	if (!email || !password) {
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
		[result] = await getUserByCredentials(email);

		// compare passwd with its hash from db
		console.log("Pre Pass Verify: ", result);

		let passwdVerification = result
			? await verifyPasswd(password, result?.auth?.passwordHash)
			: false;
		console.log("Post Pass Verify: ", passwdVerification);
		if (!passwdVerification || !result) {
			// no email found or passwd is incorrect
			return res
				.status(403)
				.json({ success: false, msg: "Email or Password is Incorrect!!!" });
		}
	} catch (error) {
		console.error("handleLogin: ", error);
		return res.status(400).json({
			success: false,
			msg: "Error Occured: Authentication",
		});
	}
	// payload created for access token
	const payload = {
		userID: result?.users?.userID,
		username: result?.users?.username,
		email: result?.users?.email,
		verified: result?.users?.emailVerified,
		role: result?.users?.role,
		plan: result?.users?.plan,
	};
	// create access token
	const accessToken = genAccessToken(payload);
	// create refresh token
	const refreshToken = genRefreshToken({ userID: payload?.userID });
	if (!accessToken || !refreshToken) {
		// check if access token & refresh token is created or not
		return res.status(500).json({
			success: false,
			msg: "Access or Refresh token creation failed!!!",
		});
	}
	// insert refresh token into db to track user session
	// TODO: check for already using refresh token for current user
	await insertRefreshToken(refreshToken, payload?.userID);

	res.cookie("refresh_token", refreshToken, {
		// 14 days (in miliseconds)
		maxAge: 1000 * 60 * 60 * 24 * 14,
		httpOnly: true,
		secure: true,
		sameSite: "None",
	});
	// send the success response to login with access token & public key to verify it
	return res.status(200).json({
		success: true,
		access_token: accessToken,
		public_key: publicKey,
		master_salt: result?.auth?.salt,
		msg: "Log In Successful!!!",
	});
};

// Register by Creating a new User Account
export const handleRegister = async (req, res) => {
	// extract fields from request body
	console.log("Register Initialised");

	const { email, username, password, masterSalt } = req.body.payload;
	console.log(req.body);

	// check if all fields are present
	if (!email || !username || !password || !masterSalt) {
		return res.status(400).json({
			success: false,
			msg: "Missing Required Fields!!!",
		});
	}
	//	Check Schemas for all fields
	const emailCheck = emailSchema.safeParse(email);
	const nameCheck = nameSchema.safeParse(username);
	const passwdCheck = passwdSchema.safeParse(password);
	if (!emailCheck.success || !nameCheck.success || !passwdCheck.success) {
		return res.status(400).json({
			success: false,
			msg: "Proper Format of the Fields are Required!!!",
		});
	}
	console.log("Check 1: ", email, username, password, masterSalt);
	console.log("Register Check Complete");

	// Create hash from passwd
	const hashPassword = await genPasswdHash(password);
	// Insert User Credential into db
	const result = await insertUserByCredential(
		email,
		username,
		hashPassword,
		masterSalt
	);
	console.log("Check 2: ", result);
	if (result) {
		// success to register new user
		return res
			.status(201)
			.json({ success: true, msg: "User Account is Created!!!" });
	}
	console.log("Check 2");
	// failed to register new user
	return res.status(409).json({
		success: false,
		msg: "User already registered or failed to create new user!!!",
	});
};

export const handleGetPublicKey = async (req, res) => {
	// read the public key from file
	if (publicKey) {
		// if public key found
		return res
			.status(200)
			.json({ success: true, msg: "Public Key Found and Sent!!!", publicKey });
	} else {
		// if public key not found
		return res
			.status(404)
			.json({ success: false, msg: "Public Key Not Available!!!" });
	}
};

export const handleGetMasterSalt = async (req, res) => {
	// if (!req.user) {
	// 	return res
	// 		.status(400)
	// 		.json({ success: false, msg: "You are not Logged In!!!" });
	// }
	console.log("Getting Salt Initiated");

	const { email, password } = req.body;
	console.log("Email & password: ", email, password);

	if (!email || !password) {
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
		[result] = await getUserByCredentials(email);

		// compare passwd with its hash from db
		let passwdVerification = result
			? await verifyPasswd(password, result?.auth?.passwordHash)
			: false;
		if (!passwdVerification || !result) {
			// no email found or passwd is incorrect
			return res
				.status(403)
				.json({ success: false, msg: "Email or Password is Incorrect!!!" });
		}
		res.status(200).json({
			success: true,
			msg: "Salt is Sent!!!",
			master_salt: result?.auth?.salt,
		});
	} catch (error) {
		// console.log("handleLogin: ", error);
		return res.status(400).json({
			success: false,
			msg: "Error Occured: Salt Retrival Failed",
		});
	}
};

export const handleRefreshToken = async (req, res) => {
	// get user refresh token from req
	let refreshToken = req.cookies?.refresh_token;
	console.log("Refresh token called");
	console.log(refreshToken);

	// verify & decode the refresh token
	if (!refreshToken) {
		// send response for no refresh token
		return res
			.status(403)
			.json({ success: false, msg: "Refresh Token Not Received!!!" });
	}
	const [decodedRefreshToken] = await verifyRefreshToken(refreshToken);
	// it verify, refresh token is valid & exist inside session db
	if (!decodedRefreshToken) {
		return res
			.status(404)
			.json({ success: false, msg: "Invalid or Expired Token!!!" });
	}
	const userID = decodedRefreshToken?.users?.userID;
	console.log("Auth Controller->Decoded Refresh Token: ", decodedRefreshToken);

	// payload for new access token creation
	const payload = {
		userID: decodedRefreshToken?.users?.userID,
		username: decodedRefreshToken?.users?.username,
		email: decodedRefreshToken?.users?.email,
		verified: decodedRefreshToken?.users?.emailVerified,
		role: decodedRefreshToken?.users?.role,
		plan: decodedRefreshToken?.users?.plan,
	};
	const newAccessToken = genAccessToken(payload);
	// new Access Token is created & sent with public key
	return res.status(200).json({ access_token: newAccessToken, publicKey });
};

export const handleLogout = async (req, res) => {
	// user refresh token is read
	if (!req.user) {
		return res
			.status(400)
			.json({ success: false, msg: "You are not Logged In!!!" });
	}
	const refreshToken = req.cookies.refresh_token;
	// remove the session refresh token
	const [result] = await removeRefreshToken(refreshToken);
	// remove cookies from client system
	res.clearCookie("refresh_token", {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		path: "/",
	});
	return res.status(200).json({ success: true, message: "User Logged Out" });
};
