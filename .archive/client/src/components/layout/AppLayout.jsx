import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router";
import { Home } from "../pages/Home";

export function AppLayout() {
	return (
		<>
			<Header />
			{/* <Outlet /> */}
			<Home />
			<Footer />
		</>
	);
}
