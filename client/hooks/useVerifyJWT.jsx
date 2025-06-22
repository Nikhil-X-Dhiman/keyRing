import { useAuth } from "./useAuth";
import { jwtVerify, importSPKI } from "jose";

export const useVerifyAccessToken = () => {
	const { publicKey } = useAuth();

	const verifyToken = async (token) => {
		if (!publicKey) {
			console.warn("Public Key Not available for Token Verification");
			return {
				isValid: false,
				payload: null,
				error: "Public Key Not Available",
			};
		}
		if (!token) {
			console.warn("No Token is provided for Verification");
			return { isValid: false, payload: false, error: "No Token is Available" };
		}
		try {
			const importedPublicKey = await importSPKI(publicKey, "RS256");
			const { payload } = await jwtVerify(token, importedPublicKey);
			console.log("Decoded Access Token Payload: ", payload);
			return { isValid: true, payload, error: null };
		} catch (error) {
			console.error("Token Verification Failed!!!");
			return { isValid: false, payload: null, error: error };
		}
	};
	return verifyToken;
};
