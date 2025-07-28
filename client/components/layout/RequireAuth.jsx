import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation, Outlet } from "react-router";

const RequireAuth = () => {
	const { auth } = useAuth();
	const location = useLocation();
	console.log("Inside Require Auth -> Access Token: ", auth?.user);

	return auth?.user ? (
		<Outlet />
	) : (
		<Navigate to="/login/email" state={{ from: location.pathname }} replace />
	);
};

export default RequireAuth;
