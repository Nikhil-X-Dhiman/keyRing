/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDB } from "../../hooks/useDB";
import { Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useApp } from "../../hooks/useApp";

export const InitializeDB = () => {
	const { handleDBOpen, handleFetchAppState } = useDB();
	const { setAuth, setUserLogin } = useAuth();
	const { setAppState, startLoading, endLoading, loading } = useApp();

	useEffect(() => {
		if (typeof window === "undefined") return; // SSR Protection
		startLoading();
		const initialize = async () => {
			try {
				await handleDBOpen();
				console.log("DB Initialization Successfull");
				// now loads the state to the context from localDB
				const {
					email = "",
					user = {},
					master_salt = "",
					access_token = "",
					public_key = "",
					persist = false,
					login_status = false,
				} = (await handleFetchAppState()) || {};
				// setting auth & app context
				setAppState((prev) => ({ ...prev, persist, login: login_status }));

				setAuth((prev) => ({
					...prev,
					accessToken: access_token,
					user,
					masterSalt: master_salt,
					publicKey: public_key,
				}));
				setUserLogin((prev) => ({ ...prev, email }));
			} catch (error) {
				console.error("DB Initialization Failed: ", error);
			} finally {
				endLoading();
			}
		};
		initialize();
	}, []);

	return loading ? null : <Outlet />;
};
