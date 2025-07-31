/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet } from "react-router";
import { Navigate } from "react-router";
import { useAccount } from "../../hooks/useAccount";
import { useAuth } from "../../hooks/useAuth";
import { useVerifyAccessToken } from "../../hooks/useVerifyJWT";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { useEffect } from "react";
import { useApp } from "../../hooks/useApp";

const PersistLogin = () => {
	const { appState } = useApp();
	const { auth, masterKey, derivedAuth } = useAuth();
	const { logout } = useAccount();
	const { verifyToken } = useVerifyAccessToken();
	const refreshToken = useRefreshToken();

	useEffect(() => {
		(async () => {
			if (auth.accessToken) {
				console.log("Persist Login -> Old Access token: ", auth.accessToken);
				const { success } = await verifyToken(
					auth.accessToken,
					derivedAuth.publicKey
				);
				console.log("Persist Login -> Verify Old Access Token ", success);

				if (!success) {
					refreshToken();
				}
			}
		})();
	}, []);

	console.log("Persist Loading Starts");

	if (!appState.persist && !masterKey) {
		logout();
		return <Navigate to="/login/email" />;
	}

	return <Outlet />;
};

export default PersistLogin;
