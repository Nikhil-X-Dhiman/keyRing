/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from "react";
import { AuthContext } from "./AuthContextObject";

export const AuthProvider = ({ children }) => {
	const initialAuthValues = { accessToken: "", user: null };
	const derivedAuthValues = { masterSalt: "", publicKey: "" };

	const [auth, setAuth] = useState(initialAuthValues);
	const [derivedAuth, setDerivedAuth] = useState(derivedAuthValues);

	const handleInitAuthValues = useCallback(() => {
		setAuth(initialAuthValues);
	}, []);

	const handleInitDerivedAuthValues = useCallback(() => {
		setDerivedAuth(derivedAuthValues);
	}, []);

	return (
		<AuthContext.Provider
			value={{
				auth,
				setAuth,
				derivedAuth,
				derivedAuthValues,
				handleInitAuthValues,
				handleInitDerivedAuthValues,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
