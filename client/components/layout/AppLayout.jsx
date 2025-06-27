import { Outlet } from "react-router";
import { AppHeader } from "../AppHeader";

export const AppLayout = () => {
	return (
		// add header here
		<main className="bg-black">
			{/* <AppHeader /> */}
			<Outlet />
			<h1>Made by Nikhil Dhiman</h1>
		</main>
		// add footer here
	);
};
