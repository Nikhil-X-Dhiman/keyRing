import { useAuth } from "./useAuth";
import { jwtVerify, importSPKI } from "jose";

export const useVerifyAccessToken = () => {
	const { auth } = useAuth();

	const verifyToken = async (token, publicKey) => {
		if (!auth.publicKey && !publicKey) {
			console.warn("Public Key Not available for Token Verification");
			return {
				success: false,
				payload: null,
				error: "Public Key Not Available",
			};
		}
		if (!publicKey) {
			publicKey = auth.publicKey;
		}
		if (!token) {
			console.error("No Token is provided for Verification");
			return { success: false, payload: false, error: "No Token is Available" };
		}
		try {
			const importedPublicKey = await importSPKI(publicKey, "RS256");
			const { payload } = await jwtVerify(token, importedPublicKey);
			// console.log("Decoded Access Token Payload: ", payload);
			return { success: true, payload, error: null };
		} catch (error) {
			console.error("Token Verification Failed!!!");
			return { success: false, payload: null, error: error };
		}
	};
	return { verifyToken };
};
