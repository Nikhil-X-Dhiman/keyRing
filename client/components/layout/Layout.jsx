import { Outlet } from "react-router";

export const Layout = () => {
	return (
		// add header here
		<main>
			<h1>Header</h1>
			<Outlet />
			<h1>Footer</h1>
		</main>
		// add footer here
	);
};
