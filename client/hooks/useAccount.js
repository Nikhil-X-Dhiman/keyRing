import { useNavigate } from "react-router";
import { usePrivateInstance } from "./usePrivateInstance";
import { useDB } from "./useDB";
import { useCrypto } from "./useCrypto";
import { useAuth } from "./useAuth";
import { useApp } from "./useApp.js";

export const useAccount = () => {
	const navigate = useNavigate();

	const privateInstance = usePrivateInstance();
	const {
		handleEmptyListDB,
		// handleFullEmptyAppState,
		// handlePersistEmptyAppState,
		handleClearLocalDB,
	} = useDB();
	const { clearSessionKey } = useCrypto();
	const { handleInitAuthValues, masterKey } = useAuth();
	const { appState } = useApp();

	const logout = async () => {
		const response = await privateInstance.get("/api/v1/auth/logout", {
			withCredentials: true,
		});
		const success = response?.data?.success;
		const message = response?.data?.msg;
		console.log("logout response: ", response);

		console.log(success, message);

		if (response.status === 200) {
			console.log("logged out");
			// clears all the password table
			await handleEmptyListDB();
			console.log("Logout: Persist Value: ", appState.persist);

			// if (appState.persist) {
			// 	// clears all but publickey, persist
			// 	await handlePersistEmptyAppState();
			// } else {
			// 	// clears all the state
			// 	await handleFullEmptyAppState();
			// }
			// await handleDelDB();
			await handleClearLocalDB();
			await handleInitAuthValues();
			masterKey.current = "";
			console.log("Logout: Persist Value: ", appState.persist);
			appState.current = { persist: false, online: false };
			console.log("Logout: Persist Value: ", appState.persist);
			clearSessionKey();
			// await handleEmptyListDB();
			console.log("Lougout -> Navigation to Email");

			navigate("/login/email");
		} else {
			console.error("Error: Logging Out");
		}
	};

	return { logout };
};
