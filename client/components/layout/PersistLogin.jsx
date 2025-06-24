/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { Outlet } from "react-router";

export const PersistLogin = () => {
	const { auth, persist } = useAuth();
	const refresh = useRefreshToken();
	const [isLoading, setIsLoading] = useState(false);

	useLayoutEffect(() => {
		setIsLoading(true);
		async function verifyRefreshToken() {
			try {
				await refresh();
			} catch (error) {
				console.error("Persist Login Refreshing Token: ", error);
			} finally {
				setIsLoading(false);
			}
		}
		const isLogged = JSON.parse(localStorage.getItem("isLogged"));
		auth?.accessToken
			? setIsLoading(false)
			: isLogged
			? verifyRefreshToken()
			: setIsLoading(false);
	}, []);

	return (
		<>{persist ? isLoading ? <p>Loading...</p> : <Outlet /> : <Outlet />}</>
	);
};
