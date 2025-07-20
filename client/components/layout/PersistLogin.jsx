/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { Navigate, Outlet } from "react-router";
import { Loading } from "../pages/Loading";
import { useDB } from "../../hooks/useDB";
// import { error } from "zod/v4/locales/ar.js";

export const PersistLogin = () => {
	const { auth, setAuth, persist, setUserLogin, setPublicKey } = useAuth();
	const refresh = useRefreshToken();
	const { handleFetchAppState } = useDB();
	const [isLoading, setIsLoading] = useState(true);
	const [fetchDB, setFetchDB] = useState(false);
	let isMountedRef = useRef(null);

	useLayoutEffect(() => {
		isMountedRef.current = true;
		setIsLoading(true);
		// async function verifyRefreshToken() {
		// 	try {
		// 		console.log("Inside Persist Login -> called verifyRefreshToken");

		// 		let at = await refresh();
		// 		console.log("Inside Persist Login -> Post | Access Token Value: ", at);
		// 	} catch (error) {
		// 		console.error("Persist Login Refreshing Token: ", error);
		// 		setAuth(null);
		// 	} finally {
		// 		isMounted && setIsLoading(false);
		// 	}
		// }
		// here it loads the user state if saved inside the local DB
		const initializePersistLogin = async () => {
			if (!auth.user && persist) {
				const populateUserState = async () => {
					const userState = await handleFetchAppState();
					console.log("UserState: ", userState);

					const {
						email,
						user,
						master_salt,
						access_token,
						public_key,
						// login_status,
					} = userState;
					console.log("Master Salt: ", master_salt);

					setAuth((prev) => ({
						...prev,
						accessToken: access_token,
						user,
						masterSalt: master_salt,
					}));

					setUserLogin((prev) => ({ ...prev, email }));
					setPublicKey(public_key);
				};
				await populateUserState();
				setFetchDB(true);
			}
		};
		initializePersistLogin();

		// if (auth?.accessToken) {
		// 	setIsLoading(false);
		// } else if (persist) {
		// 	console.error("Persist Component Runs the Resfresh Token");

		// 	verifyRefreshToken();
		// } else {
		// 	setIsLoading(false);
		// }
		// return () => {
		// 	isMounted = false;
		// };
	}, []);

	useLayoutEffect(() => {
		if (fetchDB === true) {
			async function verifyRefreshToken() {
				try {
					console.log("Inside Persist Login -> called verifyRefreshToken");

					let at = await refresh();
					console.log(
						"Inside Persist Login -> Post | Access Token Value: ",
						at
					);
				} catch (error) {
					console.error("Persist Login Refreshing Token: ", error);
					setAuth(null);
				} finally {
					isMountedRef.current && setIsLoading(false);
				}
			}

			if (auth?.accessToken) {
				setIsLoading(false);
			} else if (persist) {
				console.error("Persist Component Runs the Resfresh Token");

				verifyRefreshToken();
			} else {
				setIsLoading(false);
			}
			return () => {
				isMountedRef.current = false;
			};
		}
	}, [fetchDB]);

	if (isLoading) {
		// return <p>Persit Login: Loading...</p>;
		return <Loading loading={isLoading} />;
	}

	return <Outlet />;
};
