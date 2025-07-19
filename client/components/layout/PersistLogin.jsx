/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { Navigate, Outlet } from "react-router";
import { Loading } from "../pages/Loading";

export const PersistLogin = () => {
	const { auth, setAuth, persist } = useAuth();
	const refresh = useRefreshToken();
	const [isLoading, setIsLoading] = useState(true);

	useLayoutEffect(() => {
		let isMounted = true;
		setIsLoading(true);
		async function verifyRefreshToken() {
			try {
				console.log("Inside Persist Login -> called verifyRefreshToken");

				let at = await refresh();
				console.log("Inside Persist Login -> Post | Access Token Value: ", at);
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
		// return <p>Persit Login: Loading...</p>;
		return <Loading loading={isLoading} />;
	}

	return <Outlet />;
};
