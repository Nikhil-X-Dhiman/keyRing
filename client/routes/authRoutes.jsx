import { Layout } from "../components/layout/Layout";
import { PersistLogin } from "../components/layout/PersistLogin";
import { LoginEmail } from "../components/LoginEmail";
import { LoginPasswd } from "../components/LoginPasswd";
import { Register } from "../components/Register";

export const authRoutes = [
	{
		element: <PersistLogin />,
		children: [
			{
				path: "login",
				element: <Layout />,
				children: [
					{
						path: "email",
						element: <LoginEmail />,
					},
					{
						path: "password",
						element: <LoginPasswd />,
					},
				],
			},
			{
				path: "register",
				element: <Register />,
			},
		],
	},
];
