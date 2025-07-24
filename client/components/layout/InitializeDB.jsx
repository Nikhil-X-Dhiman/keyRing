/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDB } from "../../hooks/useDB";
import { Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useApp } from "../../hooks/useApp";

export const InitializeDB = () => {
	// const { handleDBOpen, handleFetchFullAppState, handleInitializeAppState } =
	// 	useDB();
	// const { setAuth, setUserLogin } = useAuth();
	// const { setAppState, loading, setDBLoaded } =
	// 	useApp();

	// useEffect(() => {
	// 	if (typeof window === "undefined") return; // SSR Protection
	// 	startLoading();
	// 	setDBLoaded(false);
	// 	const initialize = async () => {
	// 		try {
	// 			// open connection to DB
	// 			await handleDBOpen();
	// 			console.log("DB Initialization Successfull");
	// 			// loads the state to the context from localDB
	// 			const state = await handleFetchFullAppState();
	// 			if (state && state.persist) {
	// 				console.log("DB Found -> Updating States");

	// 				const {
	// 					email = "",
	// 					user = {},
	// 					master_salt = "",
	// 					access_token = "",
	// 					public_key = "",
	// 					persist = false,
	// 					login_status = false,
	// 				} = state;
	// 				// setting auth & app context
	// 				setAppState((prev) => ({ ...prev, persist, login: login_status }));

	// 				setAuth((prev) => ({
	// 					...prev,
	// 					accessToken: access_token,
	// 					user,
	// 					masterSalt: master_salt,
	// 					publicKey: public_key,
	// 				}));
	// 				setUserLogin((prev) => ({ ...prev, email }));
	// 			} else {
	// 				// if no db found & initialize db with default values
	// 				await handleInitializeAppState();
	// 				console.log("DB Not Found -> Initialization Successfull");
	// 			}
	// 		} catch (error) {
	// 			console.error("DB Initialization Failed: ", error);
	// 		} finally {
	// 			setDBLoaded(true);
	// 			endLoading();
	// 		}
	// 	};
	// 	initialize();
	// }, []);
	const loading = false;
	return loading ? null : <Outlet />;
};
