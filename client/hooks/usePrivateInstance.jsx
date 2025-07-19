import { useEffect } from "react";
import { privateInstance } from "../api/axios";
import { useAuth } from "./useAuth";
import { useRefreshToken } from "./useRefreshToken";
// use this hook instance for requesting resourses that require authentication to access
export const usePrivateInstance = () => {
	const refresh = useRefreshToken();

	const { auth, setAuth } = useAuth();

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
				console.log("Axios -> Response Intercept Error: ", error);

				const prevRequest = error?.config;
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();
					// check the access token and store access token in global state
					setAuth((prev) => ({ ...prev, accessToken: newAccessToken }));

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
	}, [auth, refresh, setAuth]);

	return privateInstance;
};
