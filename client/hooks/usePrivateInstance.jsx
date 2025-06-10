import { useEffect } from "react";
import { privateInstance } from "../api/axios";
import { useAuth } from "./useAuth";
import { useRefreshToken } from "./useRefreshToken";

export const usePrivateInstance = () => {
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	useEffect(() => {
		const reqIntercept = privateInstance.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			},
			(error) => {
				Promise.reject(error);
			}
		);

		const resIntercept = privateInstance.interceptors.response.use(
			(response) => response,
			async (error) => {
				console.log("Response Intercept Error: ", error);

				const prevRequest = error?.config;
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();
					prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
					return privateInstance(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			privateInstance.interceptors.response.eject(resIntercept);
			privateInstance.interceptors.request.eject(reqIntercept);
		};
	}, [auth, refresh]);

	return privateInstance;
};
