import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation, Outlet } from "react-router";

export const RequireAuth = () => {
	const { auth } = useAuth();
	// TODO: Delete the auth.user below in production
	// auth.user = { name: "Nikhil", role: "admin" };
	const location = useLocation();
	return auth?.user ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
};
