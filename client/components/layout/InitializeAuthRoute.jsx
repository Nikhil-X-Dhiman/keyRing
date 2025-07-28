import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const InitializeAuthRoute = () => {
	const location = useLocation();
	const { auth } = useAuth();
	const path = location.pathname;
	const from = location.state?.from || "/home";

	if ((path === "/login/email" || path === "login/password") && auth.user) {
		return <Navigate to={from} replace />;
	}

	return <Outlet />;
};

export default InitializeAuthRoute;
