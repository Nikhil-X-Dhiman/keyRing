import { Link } from "react-router";
// import { LoginEmail } from "./LoginEmail";
export const Home = () => {
	return (
		<div className="bg-slate-700 text-slate-300">
			<h1>Home</h1>
			<h4>Welcome to KeyRing</h4>
			<span>Click this to start Login -{"> "}</span>
			<Link to="/login/email">Login</Link>
		</div>
	);
};
