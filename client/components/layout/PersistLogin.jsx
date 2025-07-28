/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet } from "react-router";
import { useApp } from "../../hooks/useApp";
import { Navigate } from "react-router";
import { useAccount } from "../../hooks/useAccount";

const PersistLogin = () => {
	const { appState } = useApp();
	const { logout } = useAccount();

	console.log("Persist Loading Starts");

	if (!appState.persist) {
		logout();
		return <Navigate to="/login/email" />;
	}

	return <Outlet />;
};

export default PersistLogin;
