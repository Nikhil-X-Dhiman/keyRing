/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { emailSchema } from "../../utils/authSchema";
import { AuthFormHeader } from "../AuthFormHeader";
import { InputField } from "../InputField";
import { Button } from "../Button";
import { CheckboxField } from "../CheckboxField.jsx";
import { useDB } from "../../hooks/useDB.js";
import { Loading } from "./Loading.jsx";
import { useApp } from "../../hooks/useApp.js";

export const LoginEmail = () => {
	const EMAIL_REGEX =
		/^[a-zA-Z][\w]+([._$%&]?[\w]+)*@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/;
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const location = useLocation();
	const from = location.state?.from || "/user/home";
	const navigate = useNavigate();

	const emailRef = useRef();
	const errRef = useRef();
	const [inputError, setInputError] = useState("");
	const [touched, setTouched] = useState(false);

	const { userLogin, validEmail, setUserLogin, setValidEmail } = useAuth();

	const { appState, setAppState, loading } = useApp();

	const { handleUpdateAppState } = useDB();

	useEffect(() => {
		emailRef.current?.focus();
	}, []);

	useEffect(() => {
		errRef.current?.focus();
	}, [inputError]);

	useEffect(() => {
		const { success } = emailSchema.safeParse(userLogin.email);
		setValidEmail(success);
		setTouched(true);
		if (touched) {
			setInputError(
				success
					? ""
					: 'Email must contain username, "@" & domain name. Characters Allowed are [a-z], [0-9] & [ ._$%& ]'
			);
		}
	}, [userLogin.email]);

	useEffect(() => {
		if (!appState.persist && userLogin.email) {
			(async () => {
				await handleUpdateAppState("email", "");
			})();
		}
	}, [appState.persist]);

	const handleEmailSubmit = async (e) => {
		e.preventDefault();
		await handleUpdateAppState("persist", appState.persist);
		if (appState.persist) {
			try {
				await handleUpdateAppState("email", userLogin.email);
			} catch (error) {
				console.error("Error Remembering User Email", error);
			}
		}

		if (validEmail) {
			navigate("/login/password", { state: { from: from }, replace: true });
		}
	};

	const togglePersist = () => {
		setAppState((prev) => ({ ...prev, persist: !prev.persist }));
	};

	if (loading === true) {
		return <Loading loading={loading} />;
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
							ref={emailRef}
							value={userLogin.email}
							error={inputError}
							onChange={(e) =>
								setUserLogin((prev) => ({ ...prev, email: e.target.value }))
							}
						/>

						<CheckboxField
							label="Remember Me"
							id="login-remember"
							onChange={togglePersist}
							checked={appState.persist}
						/>

						<Button
							title={`${
								validEmail
									? "Submit & Continue to Password Page"
									: "Enter Valid Email in Above Field !!!"
							}`}
							disabled={!validEmail}
							variant={validEmail ? "primary" : "disabled"}
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
