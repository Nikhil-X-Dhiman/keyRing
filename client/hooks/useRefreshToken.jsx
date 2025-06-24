// import { useEffect } from "react";
import { instance } from "../api/axios";
import { useAuth } from "./useAuth";
import { useVerifyAccessToken } from "./useVerifyJWT";

export const useRefreshToken = () => {
	const { setAuth, setPublicKey } = useAuth();
	const verifyToken = useVerifyAccessToken();

	const refreshToken = async () => {
		try {
			const response = await instance.get("/api/v1/auth/refresh", {
				withCredentials: true,
			});
			const accessToken = response.data.access_token;
			const publicKey = response.data.publicKey;
			setPublicKey(publicKey);
			const { isValid, payload } = await verifyToken(accessToken, publicKey);
			if (isValid) {
				setAuth({ accessToken, user: payload });
			}
			return accessToken;
		} catch (error) {
			if (error.response.data.success === false) {
				console.error(error.response.data.message);
			} else {
				console.error(error);
			}
		}
	};
	return refreshToken;
};
