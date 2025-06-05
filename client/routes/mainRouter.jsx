import { createBrowserRouter } from "react-router";
import { authRoutes } from "./authRoutes";
import { publicRoutes } from "./publicRoutes";
import { userRoutes } from "./userRoutes";

export const router = createBrowserRouter([
	{
		path: "/",
		// errorElement: <h1>Something Went Wrong</h1>,
		children: [...authRoutes, publicRoutes, userRoutes],
	},
]);
