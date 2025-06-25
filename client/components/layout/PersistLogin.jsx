/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { Navigate, Outlet, useLocation } from "react-router";

export const PersistLogin = () => {
	const { auth, setAuth, persist } = useAuth();
	const refresh = useRefreshToken();
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();

	useLayoutEffect(() => {
		let isMounted = true;
		setIsLoading(true);
		async function verifyRefreshToken() {
			try {
				await refresh();
			} catch (error) {
				console.error("Persist Login Refreshing Token: ", error);
				setAuth(null);
			} finally {
				isMounted && setIsLoading(false);
			}
		}
		if (auth?.accessToken) {
			setIsLoading(false);
		} else if (persist) {
			verifyRefreshToken();
		} else {
			setIsLoading(false);
		}
		return () => {
			isMounted = false;
		};
	}, []);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (auth?.accessToken) {
		const isAuthPage =
			location.pathname.startsWith("/login") ||
			location.pathname.startsWith("/register");
		if (isAuthPage) {
			return <Navigate to={"/user/home"} replace />;
		}
		return <Outlet />;
	}

	return <Outlet />;
};
