import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation, Outlet } from "react-router";

export const RequireAuth = () => {
	const { auth } = useAuth();
	const location = useLocation();
	return auth?.user ? (
		<Outlet />
	) : (
		<Navigate to="/login/email" state={{ from: location }} replace />
	);
};
