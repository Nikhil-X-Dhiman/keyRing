import { MainPage } from "../components/MainPage";
import { RequireAuth } from "../components/RequireAuth";
import { AppLayout } from "../components/layout/AppLayout";
import { Layout } from "../components/layout/Layout";
import { PersistLogin } from "../components/layout/PersistLogin";
import { UnLock } from "../components/pages/UnLock";

export const userRoutes = [
	{
		element: <PersistLogin />,
		children: [
			{
				element: <RequireAuth />,
				children: [
					{
						path: "user/home",
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
