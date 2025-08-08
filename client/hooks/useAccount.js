import { useNavigate } from "react-router";
import { usePrivateInstance } from "./usePrivateInstance";
import { useDB } from "./useDB";
import { useCrypto } from "./useCrypto";
import { useAuth } from "./useAuth";
import { useApp } from "./useApp.js";
import { ErrorModal } from "../components/ErrorModal.jsx";

export const useAccount = () => {
	const navigate = useNavigate();

	const privateInstance = usePrivateInstance();
	const { handleEmptyListDB, handleClearLocalDB } = useDB();
	const { clearSessionKey } = useCrypto();
	const { handleInitAuthValues, masterKey } = useAuth();
	const { appState } = useApp();

	const logout = async () => {
		try {
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
		} catch (error) {
			console.error(
				"useAccount > logout: Error Logging Out of Device. Check your Connection: ",
				error
			);
			throw new Error(
				"useAccount > logout: Error Logging Out of Device. Check your Connection"
			);
		}
	};

	return { logout };
};
