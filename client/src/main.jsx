import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import { router } from "../routes/mainRouter.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			{/* <App /> */}
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>
);
