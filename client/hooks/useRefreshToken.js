// import { useEffect } from "react";
import { instance } from "../api/axios";
import { useAuth } from "./useAuth";
import { useDB } from "./useDB";
import { useVerifyAccessToken } from "./useVerifyJWT";

export const useRefreshToken = () => {
	const { setAuth, setPublicKey, setUserLogin } = useAuth();
	const verifyToken = useVerifyAccessToken();
	const { handleAddNewAccessTokenDB } = useDB();

	const refreshToken = async () => {
		console.log("Pre Refresh Token RUN");
		try {
			// private instance not required as accessToken is not needed here
			const response = await instance.get("/api/v1/auth/refresh", {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});
			console.log("Post Refresh Token RUN");
			const accessToken = response.data.access_token;
			console.log("new access token: ", accessToken);
			// updating access token with newer one
			try {
				await handleAddNewAccessTokenDB(accessToken);
				console.log("DB updated with new access token");
			} catch (error) {
				console.error(error);
			}

			const publicKey = response.data.publicKey;
			console.log(accessToken, publicKey);

			setPublicKey(publicKey);

			const { success, payload } = await verifyToken(accessToken, publicKey);
			if (success) {
				setAuth((prev) => ({ ...prev, accessToken, user: payload }));
				setUserLogin((prev) => ({ ...prev, email: payload.email }));
			}
			return accessToken || null;
		} catch (error) {
			if (error?.response?.data?.success === false) {
				console.error("Token Refresh Failed: ", error?.response?.data?.message);
			} else {
				console.error("Unknown error during token refresh: ", error);
			}
		}
	};
	return refreshToken;
};
