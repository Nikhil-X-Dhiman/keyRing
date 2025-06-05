import { Link } from "react-router";
import { LoginEmail } from "./LoginEmail";
export const Home = () => {
	return (
		<>
			<h1>Home</h1>
			<h4>Welcome to KeyRing</h4>
			<p>Click this to start Login --&gt</p>
			<Link to={LoginEmail}>Login</Link>
		</>
	);
};
