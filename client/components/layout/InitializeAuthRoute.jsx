import { Navigate, Outlet, useLocation } from "react-router";
import { useApp } from "../../hooks/useApp";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

const InitializeAuthRoute = () => {
	const location = useLocation();
	const { appState, startLoading, endLoading, dbLoaded } = useApp();
	const { auth, userLogin, validEmail } = useAuth();
	const [redirect, setRedirect] = useState(null);

	useEffect(() => {
		if (dbLoaded) {
			// startLoading();
			const path = location.pathname;
			const from = location.state?.from || "/user/home";

			if (
				path === "/login/email" &&
				userLogin.email &&
				appState.persist &&
				validEmail
			) {
				setRedirect("/login/password");
			} else if (path === "/login/email" && from === "/login/password") {
				setRedirect(null);
			} else if (
				(path === "/login/email" || path === "/login/password") &&
				auth.user?.email &&
				appState.login
			) {
				console.log("Triggering triggering");

				setRedirect("/user/home");
			} else if (path === "/login/password" && !validEmail) {
				setRedirect("/login/email");
			} else {
				setRedirect(null);
			}
			// endLoading();
		}
	}, [dbLoaded, location.pathname, location.state]);

	if (!dbLoaded) {
		return null;
	}

	if (redirect) {
		return <Navigate to={redirect} replace />;
	}
	return <Outlet />;
};

export default InitializeAuthRoute;
