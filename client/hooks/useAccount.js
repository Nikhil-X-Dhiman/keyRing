import { useNavigate } from "react-router";
import { usePrivateInstance } from "./usePrivateInstance";
import { useDB } from "./useDB";
import { useCrypto } from "./useCrypto";
import { useAuth } from "./useAuth";
import { useApp } from "./useApp.js";

export const useAccount = () => {
	const navigate = useNavigate();

	const { privateInstance } = usePrivateInstance();
	const {
		handleEmptyListDB,
		handleEmptyAppState: handleFullEmptyAppState,
		handlePersistEmptyAppState,
	} = useDB();
	const { clearSessionKey } = useCrypto();
	const { handleInitAuthValues } = useAuth();
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
			await handleEmptyListDB();
			if (appState.persist) {
				handlePersistEmptyAppState;
			} else {
				await handleFullEmptyAppState();
			}
			// await handleDelDB();
			handleInitAuthValues();
			appState.current = { ...appState.current, persist: appState.persist };
			clearSessionKey();
			navigate("/login/email");
		} else {
			console.error("Error: Logging Out");
		}
	};

	return { logout };
};
