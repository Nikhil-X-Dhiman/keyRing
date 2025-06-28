import { MainPage } from "../components/MainPage";
import { RequireAuth } from "../components/RequireAuth";
import { AppLayout } from "../components/layout/AppLayout";
import { Layout } from "../components/layout/Layout";
import { PersistLogin } from "../components/layout/PersistLogin";

export const userRoutes = [
	{
		element: <PersistLogin />,
		children: [
			{
				path: "user/home",
				element: <RequireAuth />,
				children: [
					{
						element: <Layout />,
						children: [
							{
								index: true,
								element: <MainPage />,
							},
						],
					},
				],
			},
		],
	},
];
