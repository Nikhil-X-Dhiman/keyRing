import { MainPage } from "../components/MainPage";
import { RequireAuth } from "../components/RequireAuth";
import { AppLayout } from "../components/layout/AppLayout";

export const userRoutes = [
	{
		path: "user",
		// element: <RequireAuth />,'
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
];
