/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useLocation } from "react-router";
import { useApp } from "../../hooks/useApp";
import { Navigate } from "react-router";
import { useAccount } from "../../hooks/useAccount";
import { useAuth } from "../../hooks/useAuth";

const PersistLogin = () => {
	const { appState } = useApp();
	const { masterKey } = useAuth();
	const location = useLocation();
	const { logout } = useAccount();

	console.log("Persist Loading Starts");

	if (!appState.persist && !masterKey) {
		logout();
		return <Navigate to="/login/email" />;
	}

	return <Outlet />;
};

export default PersistLogin;
