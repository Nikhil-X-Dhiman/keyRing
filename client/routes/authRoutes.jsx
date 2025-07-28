import React from "react";

const InitializeAuthRoute = React.lazy(() =>
	import("../components/layout/InitializeAuthRoute")
);
const Layout = React.lazy(() => import("../components/layout/Layout"));
const Register = React.lazy(() => import("../components/pages/Register"));
const LoginEmail = React.lazy(() => import("../components/pages/LoginEmail"));
const LoginPasswd = React.lazy(() => import("../components/pages/LoginPasswd"));

export const authRoutes = [
	{
		element: <InitializeAuthRoute />,
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
