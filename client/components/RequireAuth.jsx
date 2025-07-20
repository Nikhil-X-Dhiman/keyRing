import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation, Outlet } from "react-router";

export const RequireAuth = () => {
	const { auth } = useAuth();
	const location = useLocation();
	console.log("Inside Require Auth -> Access Token: ", auth?.accessToken);

	return auth?.accessToken ? (
		<Outlet />
	) : (
		<Navigate to="/login/email" state={{ from: location }} replace />
	);
};
