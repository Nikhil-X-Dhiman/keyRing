import { useState } from "react";
import { AuthContext } from "./AuthContextObject";

export const AuthProvider = ({ children }) => {
	const defaultUserValues = { email: "", passwd: "" };
	const [auth, setAuth] = useState(null);
	const [persist, setPersist] = useState(
		JSON.parse(localStorage.getItem("persist")) || false
	);
	const [publicKey, setPublicKey] = useState("");
	const [userLogin, setUserLogin] = useState(defaultUserValues);
	const [userRegister, setUserRegister] = useState({
		email: "",
		name: "",
		passwd: "",
	});
	const [validEmail, setValidEmail] = useState(false);
	const [validPasswd, setValidPasswd] = useState(false);
	const [masterKey, setMasterKey] = useState("");

	return (
		<AuthContext.Provider
			value={{
				auth,
				setAuth,
				defaultUserValues,
				persist,
				setPersist,
				userLogin,
				setUserLogin,
				publicKey,
				setPublicKey,
				validEmail,
				setValidEmail,
				userRegister,
				setUserRegister,
				validPasswd,
				setValidPasswd,
				masterKey,
				setMasterKey,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
