import { Navigate, Outlet, useLocation } from "react-router";
import { useApp } from "../../hooks/useApp";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

export const InitializeAuthRoute = () => {
	const location = useLocation();
	const { appState, startLoading, endLoading } = useApp();
	const { auth, userLogin, validEmail } = useAuth();
	const [redirect, setRedirect] = useState(null);

	useEffect(() => {
		startLoading();
		const path = location.pathname;
		const from = location.state?.from || "/user/home";

		if (
			path === "/login/email" &&
			userLogin.email &&
			appState.persist &&
			validEmail
		) {
			setRedirect("/login/passwd");
		} else if (path === "/login/email" && from === "/login/passwd") {
			endLoading();
			setRedirect(null);
		} else if (
			(path === "/login/email" || path === "/login/passwd") &&
			auth.user?.email &&
			appState.login
		) {
			setRedirect("/user/home");
		} else {
			setRedirect(null);
		}
		endLoading();
	}, []);

	if (redirect) {
		return <Navigate to={redirect} replace />;
	}
	return <Outlet />;
};
