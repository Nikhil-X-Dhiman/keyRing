import { useState } from "react";
import { AuthContext } from "./AuthContextObject";

export const AuthProvider = ({ children }) => {
	const defaultUserValues = { email: "", password: "" };
	const defaultAuthValues = {
		accessToken: "",
		user: {},
		masterKey: "",
		masterSalt: "",
		publicKey: "",
	};
	const defaultRegisterValues = {
		email: "",
		username: "",
		password: "",
		masterSalt: "",
	};

	const [auth, setAuth] = useState(defaultAuthValues);

	const [userLogin, setUserLogin] = useState(defaultUserValues);
	const [userRegister, setUserRegister] = useState(defaultRegisterValues);

	const [passwdList, setPasswdList] = useState([]);

	const [validEmail, setValidEmail] = useState(false);
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
				passwdList,
				setPasswdList,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
