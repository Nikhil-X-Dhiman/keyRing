import { Outlet } from "react-router";

export const Layout = () => {
	return (
		// add header here
		<main className="bg-gray-800 text-slate-200">
			<h1>Header</h1>
			<Outlet />
			<h1>Footer</h1>
		</main>
		// add footer here
	);
};
