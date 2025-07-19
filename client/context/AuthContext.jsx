import { useState } from "react";
import { AuthContext } from "./AuthContextObject";

export const AuthProvider = ({ children }) => {
	const defaultUserValues = { email: "", passwd: "" };
	const defaultAuthValues = { accessToken: "", user: "", masterKey: "" };
	const defaultRegisterValues = {
		email: "",
		name: "",
		passwd: "",
		masterSalt: "",
	};
	const [auth, setAuth] = useState(defaultAuthValues);
	const [userLogin, setUserLogin] = useState(defaultUserValues);
	const [userRegister, setUserRegister] = useState(defaultRegisterValues);
	const [persist, setPersist] = useState(
		JSON.parse(localStorage.getItem("persist")) || false
	);
	const [publicKey, setPublicKey] = useState("");
	const [validEmail, setValidEmail] = useState(false);
	const [validPasswd, setValidPasswd] = useState(false);
	const [masterKey, setMasterKey] = useState("");
	const [passwdList, setPasswdList] = useState([]);
	const [appLoading, setAppLoading] = useState(false);

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
				passwdList,
				setPasswdList,
				appLoading,
				setAppLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
