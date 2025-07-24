/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { Outlet, useLocation } from "react-router";
import { useApp } from "../../hooks/useApp";
import { useVerifyAccessToken } from "../../hooks/useVerifyJWT";
import { Navigate } from "react-router";

export const PersistLogin = () => {
	const { auth, setAuth } = useAuth();
	const refreshToken = useRefreshToken();
	const { verifyToken } = useVerifyAccessToken();
	const { loading, startLoading, endLoading, dbLoaded, appState } = useApp();
	const location = useLocation();
	const [redirect, setRedirect] = useState(null);

	useEffect(() => {
		console.log("Persist Loading Starts");
		console.log("DB Loading: ", dbLoaded);

		if (dbLoaded) {
			startLoading();
			const initializePersistLogin = async () => {
				// async function refreshAccessToken() {
				// 	try {
				// 		console.log("Persist Login -> Pre Access Token Value");

				// 		let at = await refreshToken();
				// 		console.log("Persist Login -> Post Access Token Value: ", at);
				// 	} catch (error) {
				// 		console.error(
				// 			"Error: Persist Login -> Access Token Generation: ",
				// 			error
				// 		);
				// 		setAuth(null);
				// 	}
				// }

				// const fetchAccessToken = async () => {
				// 	const { success } = await verifyToken(
				// 		auth.accessToken,
				// 		auth.publicKey
				// 	);
				// 	if (!success) {
				// 		console.log(
				// 			"Persist: Access token is invalid...Calling to server for new access token"
				// 		);

				// 		await refreshAccessToken();
				// 		console.log("Persist: New Access token is received");
				// 	} else {
				// 		console.log("Persist: Access Token is Verified");
				// 	}
				// };

				// if (auth?.accessToken) {
				// 	console.log("Persist: Verifying Access Token");
				// 	await fetchAccessToken();
				// } else if (!auth?.accessToken) {
				// 	console.log("Persist: Refreshing Access Token");
				// 	await refreshAccessToken();
				// }
				debugger;

				if (!auth.user?.email && !auth.accessToken) {
					console.log("Persist: Redirect to Email Page");

					setRedirect("/login/email");
				} else if (!auth.masterkey && location?.state?.from !== "/locked") {
					console.log("Persist: Redirect to Locked Page");
					setRedirect("/locked");
				}
				console.log("Persist: Loading Ends");
				endLoading();
			};

			initializePersistLogin();
		}
	}, [dbLoaded]);

	if (loading) {
		return null;
	} else if (redirect) {
		return <Navigate to={redirect} replace />;
	}

	return <Outlet />;
};
