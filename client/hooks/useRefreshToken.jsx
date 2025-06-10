import { instance } from "../api/axios";
import { useAuth } from "./useAuth";

export const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refreshToken = async () => {
		const response = await instance.get("/refresh", {
			withCredentials: true,
		});
		const accessToken = response.data.access_token;
		setAuth((prev) => ({ ...prev, accessToken }));
		return accessToken;
	};
	return refreshToken;
};
