/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { Outlet } from "react-router";
import { useApp } from "../../hooks/useApp";
import { useVerifyAccessToken } from "../../hooks/useVerifyJWT";
import { Navigate } from "react-router";

export const PersistLogin = () => {
	const { auth, setAuth } = useAuth();
	const { refreshToken } = useRefreshToken();
	const { verifyToken } = useVerifyAccessToken();
	const { loading, startLoading, endLoading, dbLoaded, appState } = useApp();
	const [redirect, setRedirect] = useState(null);

	useEffect(() => {
		startLoading();
		if (dbLoaded) {
			const initializePersistLogin = async () => {
				async function refreshAccessToken() {
					try {
						console.log("Persist Login -> Pre Access Token Value");

						let at = await refreshToken();
						console.log("Persist Login -> Post Access Token Value: ", at);
					} catch (error) {
						console.error(
							"Error: Persist Login -> Access Token Generation: ",
							error
						);
						setAuth(null);
					}
				}

				const fetchAccessToken = async () => {
					const verifyAccessToken = await verifyToken(
						auth.accessToken,
						auth.publicKey
					);
					if (!verifyAccessToken) {
						await refreshAccessToken();
					}
				};

				if (auth?.accessToken && auth?.publicKey) {
					await fetchAccessToken();
				}

				if (!auth.user?.email && !auth.accessToken) {
					setRedirect("/login/email");
				} else if (!auth.masterkey || appState.vault === "lock") {
					setRedirect("/locked");
				}
			};

			initializePersistLogin();
			endLoading();
		}
	}, [dbLoaded, auth.user, appState.login, auth.masterkey]);

	if (loading) {
		return null;
	} else if (redirect) {
		return <Navigate to={redirect} replace />;
	}

	return <Outlet />;
};
