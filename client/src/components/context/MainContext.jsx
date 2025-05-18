import { createContext, useContext, useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";

export const instance = axios.create({
	baseURL: "http://localhost:3000/",
	withCredentials: true,
});

axios.defaults.withCredentials = true;
instance.defaults.withCredentials = true;

const MainContext = createContext(undefined);

export const MainProvider = ({ children }) => {
	const [email, setEmail] = useState("");

	// const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	// also handle token to save to cookies
	const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// 	try {
	// 		const access_token = Cookies.get("access_token");
	// 		console.log(access_token);
	// 		const tokenPayload = jwtDecode(access_token);
	// 		console.log(tokenPayload);
	// 	} catch {
	// 		console.log("no token found");
	// 	}
	// }, []);

	// handle logout too

	return (
		<MainContext.Provider
			value={{ user, email, setEmail, loading, setLoading }}
		>
			{children}
		</MainContext.Provider>
	);
};

export const useData = () => {
	const context = useContext(MainContext);

	if (context === undefined) {
		throw new Error("useData inside Main Provider");
	}
	return context;
};
