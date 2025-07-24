/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
// import { useAuth } from "../../hooks/useAuth";
import { emailSchema } from "../../utils/authSchema";
import { AuthFormHeader } from "../AuthFormHeader";
import { InputField } from "../InputField";
import { Button } from "../Button";
import { CheckboxField } from "../CheckboxField.jsx";
// import { useDB } from "../../hooks/useDB.js";
import { Loading } from "./Loading.jsx";
// import { useApp } from "../../hooks/useApp.js";
export const LoginEmail = () => {
	const EMAIL_REGEX =
		/^[a-zA-Z][\w]+([._$%&]?[\w]+)*@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/;
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const location = useLocation();
	const from = location.state?.from || "/user/home";
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [persist, setPersist] = useState("");
	const [inputError, setInputError] = useState("");
	// const [, forceRender] = useState();

	const validEmailRef = useRef(false);
	const emailFieldRef = useRef();
	// const inputErrorRef = useRef("");
	const touchedRef = useRef(false);

	// const {  } = useAuth();

	// const { loadingRef } = useApp();
	const loadingRef = true;

	// const { handleUpdateAppState } = useDB();

	useEffect(() => {
		emailFieldRef.current?.focus();
	}, []);

	useEffect(() => {
		// set flag to represent user starts writing in input field
		touchedRef.current = true;
		// Verify Email Schema
		const { success } = emailSchema.safeParse(email);
		// setValidEmail(success);
		// Set Flag to represent valid email
		validEmailRef.current = success;
		if (touchedRef.current) {
			// sets the error
			setInputError(
				success
					? ""
					: 'Email must contain username, "@" & domain name. Characters Allowed are [a-z], [0-9] & [ ._$%& ]'
			);
			// inputErrorRef.current = success
			// 	? ""
			// 	: 'Email must contain username, "@" & domain name. Characters Allowed are [a-z], [0-9] & [ ._$%& ]';
		}
	}, [email]);

	// useEffect(() => {
	// 	if (!appState.persist && userLogin.email) {
	// 		(async () => {
	// 			await handleUpdateAppState("email", "");
	// 		})();
	// 	}
	// }, [appState.persist]);

	const handlePersistToggle = useCallback(() => {
		console.log("Email Persist Changed");
		setPersist((prev) => !prev);
	}, []);

	const handleEmailChange = useCallback((e) => {
		setEmail(e.target.value);
	}, []);

	const handleEmailSubmit = async (e) => {
		e.preventDefault();
		// await handleUpdateAppState("persist", appState.persist);
		// if (persist) {
		// 	try {
		// 		await handleUpdateAppState("email", userLogin.email);
		// 	} catch (error) {
		// 		console.error("Error Remembering User Email", error);
		// 	}
		// }

		if (validEmailRef.current) {
			console.log("Email: Navigate to Passwd Page");
			navigate("/login/password", { state: { from: from }, replace: true });
		}
	};

	// const togglePersist = () => {
	// 	setAppState((prev) => ({ ...prev, persist: !prev.persist }));
	// };

	if (loadingRef.current === true) {
		return <Loading loading={loadingRef.current} />;
	} else {
		return (
			<>
				<main className="flex flex-col justify-center items-center pt-15 select-none">
					<AuthFormHeader
						title="Log in to KeyRing"
						imgSrc="../src/assets/vault.png"
						imgAlt="vault-img"
					/>

					<form
						onSubmit={handleEmailSubmit}
						className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md"
					>
						<InputField
							label="Email address"
							required={true}
							id="login-email"
							ref={emailFieldRef}
							value={email}
							error={inputError}
							touched={touchedRef.current}
							onChange={handleEmailChange}
						/>

						<CheckboxField
							label="Remember Me"
							id="login-remember"
							onChange={handlePersistToggle}
							checked={persist}
						/>

						<Button
							title={`${
								validEmailRef.current
									? "Submit & Continue to Password Page"
									: "Enter Valid Email in Above Field !!!"
							}`}
							disabled={!validEmailRef.current}
							variant={validEmailRef.current ? "primary" : "disabled"}
							className=""
						>
							Continue
						</Button>
					</form>
					<div>
						New to keyRing?{" "}
						<Link
							to="/register"
							className="text-blue-300 hover:text-blue-200 hover:underline transition duration-200 ease-in-out"
						>
							Create Account
						</Link>
					</div>
				</main>
			</>
		);
	}
};
