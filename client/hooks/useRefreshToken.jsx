import { instance } from "../api/axios";
import { useAuth } from "./useAuth";
import { useVerifyAccessToken } from "./useVerifyJWT";

export const useRefreshToken = () => {
	const { setAuth } = useAuth();
	const verifyToken = useVerifyAccessToken();

	const refreshToken = async () => {
		const response = await instance.get("/refresh", {
			withCredentials: true,
		});
		const accessToken = response.data.access_token;
		setAuth((prev) => ({ ...prev, accessToken }));
		const { isValid, payload } = verifyToken();
		if (isValid) {
			setAuth((prev) => ({ ...prev, user: payload }));
		}
		return accessToken;
	};
	return refreshToken;
};
