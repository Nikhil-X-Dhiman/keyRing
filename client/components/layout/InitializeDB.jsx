/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useDB } from "../../hooks/useDB";
import { Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useApp } from "../../hooks/useApp";
import { Loading } from "../pages/Loading";

export const InitializeDB = () => {
	const { handleDBOpen, handleFetchFullAppState, handleInitializeAppState } =
		useDB();
	const { setAuth, setDerivedAuth } = useAuth();
	const { appState } = useApp();
	const localLoading = useRef(true);
	const [, forceRender] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return; // SSR Protection
		localLoading.current = true;
		const initialize = async () => {
			try {
				// open connection to DB
				await handleDBOpen();
				console.log("DB Connection Successfull");
				// loads the state to the context from localDB
				const state = await handleFetchFullAppState();
				console.log("DB DATA: ", state);

				if (state) {
					console.log("DB Found -> Updating States");

					const {
						user = null,
						master_salt = "",
						access_token = "",
						public_key = "",
						persist = false,
					} = state;
					// setting auth & app context
					appState.current = { ...appState.current, persist };
					setAuth({ accessToken: access_token, user });
					setDerivedAuth({ masterSalt: master_salt, publicKey: public_key });
				} else {
					// if no db found & initialize db with default values
					await handleInitializeAppState();
					console.log(
						"DB Not Found or Not Persist -> Initialization Successfull"
					);
				}
			} catch (error) {
				console.error("DB Initialization Failed: ", error);
			} finally {
				console.log("Local DB Loading Ended");
				localLoading.current = false;
				forceRender((prev) => !prev);
			}
		};
		initialize();
	}, []);
	// const loading = false;
	return localLoading.current ? <Loading loading={true} /> : <Outlet />;
};
