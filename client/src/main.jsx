import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "../routes/mainRouter.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { AppProvider } from "../context/AppContext.jsx";
import { Loading } from "../components/pages/Loading.jsx";

if (import.meta.env.VITE_ENV === "PRODUCTION") {
	disableReactDevTools();
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Suspense fallback={<Loading loading={true} />}>
			<AppProvider>
				<AuthProvider>
					<RouterProvider router={router} />
				</AuthProvider>
			</AppProvider>
		</Suspense>
	</StrictMode>
);
