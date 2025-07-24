/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { emailSchema } from "../../utils/authSchema";
import { AuthFormHeader } from "../AuthFormHeader";
import { InputField } from "../InputField";
import { Button } from "../Button";
import { CheckboxField } from "../CheckboxField.jsx";
import { Loading } from "./Loading.jsx";

export const LoginEmail = () => {
	const EMAIL_REGEX =
		/^[a-zA-Z][\w]+([._$%&]?[\w]+)*@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/;
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const location = useLocation();
	const navigate = useNavigate();
	const from = location.state?.from || "/user/home";

	const [email, setEmail] = useState("");
	const [persist, setPersist] = useState("");
	const [inputError, setInputError] = useState("");

	const validEmailRef = useRef(false);
	const emailFieldRef = useRef();
	const touchedRef = useRef(false);
	const loadingRef = true;

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

	const handlePersistToggle = useCallback(() => {
		console.log("Email Persist Changed");
		setPersist((prev) => !prev);
	}, []);

	const handleEmailChange = useCallback((e) => {
		setEmail(e.target.value);
	}, []);

	const handleEmailSubmit = async (e) => {
		e.preventDefault();

		if (validEmailRef.current) {
			console.log("Email: Navigating to Password Page");
			navigate("/login/password", {
				state: { from, email, persist },
				replace: true,
			});
		}
	};

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
