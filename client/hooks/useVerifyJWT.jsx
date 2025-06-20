import { useAuth } from "./useAuth";
import { jwtVerify, importSPKI } from "jose";

export const useVerifyAccessToken = () => {
	const { auth, publicKey } = useAuth();

	const verifyToken = async () => {
		console.log("hit 11");

		if (!publicKey) {
			console.warn("Public Key Not available for Token Verification");
			return {
				isValid: false,
				payload: null,
				error: "Public Key Not Available",
			};
		}
		if (!auth?.accessToken) {
			console.warn("No Token is provided for Verification");
			return { isValid: false, payload: false, error: "No Token is Available" };
		}
		try {
			console.log("hit 12");

			const importedPublicKey = await importSPKI(publicKey, "RS256");
			console.log("hit 12");

			const { payload } = await jwtVerify(auth?.accessToken, importedPublicKey);
			console.log("Decoded Access Token Payload: ", payload);
			// setAuth((prev)=>({...prev, payload}))
			return { isValid: true, payload, error: null };
		} catch (error) {
			console.error("Token Verification Failed!!!");
			return { isValid: false, payload: null, error: error };
		}
	};
	return verifyToken;
};
