import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import "tailwindcss";
// import App from './App.jsx'
import { RouterProvider } from "react-router";
import { router } from "./routes/routes.js";
import { MainProvider } from "./components/context/MainContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		{/* <App /> */}
		<MainProvider>
			{/* <> */}
			<RouterProvider router={router} />
			{/* </> */}
		</MainProvider>
	</StrictMode>
);
