import React from "react";
// import { Home } from "../components/pages/Home";

const Home = React.lazy(() => import("../components/pages/Home"));

export const publicRoutes = [
	{
		index: true,
		element: <Home />,
	},
];
