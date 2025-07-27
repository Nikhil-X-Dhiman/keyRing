import React from "react";
import InitializeAuthRoute from "../components/layout/InitializeAuthRoute";

const Layout = React.lazy(() => import("../components/layout/Layout"));
const Register = React.lazy(() => import("../components/pages/Register"));
const LoginEmail = React.lazy(() => import("../components/pages/LoginEmail"));
const LoginPasswd = React.lazy(() => import("../components/pages/LoginPasswd"));

export const authRoutes = [
	{
		// element: <InitializeAuthRoute />,
		children: [
			{
				element: <Layout />,
				children: [
					{
						path: "login/email",
						element: <LoginEmail />,
					},
					{
						path: "login/password",
						element: <LoginPasswd />,
					},
					{
						path: "register",
						element: <Register />,
					},
				],
			},
		],
	},
];

// export const authRoutes = [
// 	{
// 		// re-authenticate user upon reload
// 		element: <PersistLogin />,
// 		children: [
// 			{
// 				// Layout to display header & footer
// 				element: <Layout />,
// 				children: [
// 					{
// 						path: "login/email",
// 						element: <LoginEmail />,
// 					},
// 					{
// 						path: "login/password",
// 						element: <LoginPasswd />,
// 					},
// 					{
// 						path: "register",
// 						element: <Register />,
// 					},
// 				],
// 			},
// 		],
// 	},
// ];
