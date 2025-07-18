import { Layout } from "../components/layout/Layout";
import { PersistLogin } from "../components/layout/PersistLogin";
import { LoginEmail } from "../components/LoginEmail";
import { LoginPasswd } from "../components/LoginPasswd";
import { Register } from "../components/Register";

export const authRoutes = [
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
