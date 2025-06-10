import { useState } from "react";
import { AuthContext } from "./AuthContextObject";

// export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const defaultUserValues = { email: "", passwd: "" };
	const [auth, setAuth] = useState("");
	const [userLogin, setUserLogin] = useState(defaultUserValues);
	const [userRegister, setUserRegister] = useState({
		email: "",
		name: "",
		passwd: "",
	});
	// const [email, setEmail] = useState("");
	const [validEmail, setValidEmail] = useState(false);
	// const [passwd, setPasswd] = useState("");
	const [validPasswd, setValidPasswd] = useState(false);

	return (
		<AuthContext.Provider
			value={{
				auth,
				setAuth,
				defaultUserValues,
				userLogin,
				setUserLogin,
				validEmail,
				setValidEmail,
				userRegister,
				setUserRegister,
				validPasswd,
				setValidPasswd,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
