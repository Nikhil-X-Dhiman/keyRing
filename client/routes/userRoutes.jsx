import { PersistLogin } from "../components/layout/PersistLogin";
import { RequireAuth } from "../components/layout/RequireAuth";
import { Layout } from "../components/layout/Layout";
import { MainPage } from "../components/pages/MainPage";
import { UnLock } from "../components/pages/UnLock";

export const userRoutes = [
	{
		element: <PersistLogin />, // Ensures user session is loaded/refreshed
		children: [
			{
				element: <RequireAuth />, // Protects these child routes, redirects if not authenticated
				children: [
					{
						path: "home",
						element: <Layout />,
						children: [
							{
								index: true,
								element: <MainPage />,
							},
						],
					},
					{
						path: "locked",
						element: <Layout />,
						children: [
							{
								index: true,
								element: <UnLock />,
							},
						],
					},
				],
			},
		],
	},
];
