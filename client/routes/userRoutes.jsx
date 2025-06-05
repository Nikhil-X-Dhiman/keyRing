import { RequireAuth } from "../components/RequireAuth";
import { UserHome } from "../components/UserHome";

export const userRoutes = [
	{
		path: "user",
		element: <RequireAuth />,
		children: [
			{
				path: "home",
				element: <UserHome />,
			},
		],
	},
];
