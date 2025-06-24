import { MainPage } from "../components/MainPage";
import { RequireAuth } from "../components/RequireAuth";
import { AppLayout } from "../components/layout/AppLayout";
import { PersistLogin } from "../components/layout/PersistLogin";

export const userRoutes = [
	{
		element: <PersistLogin />,
		children: [
			{
				path: "user",
				element: <RequireAuth />,
				children: [
					{
						path: "home",
						element: <AppLayout />,
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
