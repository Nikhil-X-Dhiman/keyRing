/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { emailSchema } from "../utils/authSchema.js";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import CrossIcon from "../public/cross.svg?react";
import { InputError } from "./InputError.jsx";
import { InputField } from "./InputField.jsx";
import { Button } from "./Button.jsx";
import { CheckboxField } from "./CheckboxField.jsx";
import { AuthFormHeader } from "./AuthFormHeader.jsx";

export const LoginEmail = () => {
	const EMAIL_REGEX =
		/^[a-zA-Z][\w]+([._$%&]?[\w]+)*@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/;
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);
	const location = useLocation();
	const from = location.state?.from || "/user/home";
	const navigate = useNavigate();

	const [emailFocus, setEmailFocus] = useState(false);
	const emailRef = useRef();
	const errRef = useRef();
	const [inputError, setInputError] = useState("");
	// const [pageError, setPageError] = useState("");
	const [touched, setTouched] = useState(false);
	// const [err, setErr] = useState("");

	const {
		// auth,
		userLogin,
		validEmail,
		setUserLogin,
		setValidEmail,
		persist,
		setPersist,
	} = useAuth();

	useEffect(() => {
		emailRef.current?.focus();
		setValidEmail(false);
		setUserLogin({
			email: localStorage.getItem("userEmail") || "",
			passwd: "",
		});
	}, []);

	useEffect(() => {
		errRef.current?.focus();
	}, [inputError]);

	useEffect(() => {
		if (userLogin.email) {
			const { success, error } = emailSchema.safeParse(userLogin.email);
			setTouched(true);
			if (success) {
				setValidEmail(true);
				setInputError("");
			} else {
				setValidEmail(false);
				console.log(error);

				setInputError(
					'Email must contain username, "@" & domain name. Characters Allowed are [a-z], [0-9] & [ ._$%& ]'
				);
			}
		} else if (userLogin.email === "" && touched) {
			setInputError(
				'Email must contain username, "@" & domain name. Characters Allowed are [a-z], [0-9] & [ ._$%& ]'
			);
		}
	}, [emailFocus, userLogin.email]);

	// useEffect(() => {
	// 	if (validEmail === true) {
	// 		setErr("");
	// 	}
	// }, [validEmail]);

	useEffect(() => {
		if (!persist) {
			localStorage.removeItem("userEmail");
		}
	}, [persist]);

	const handleEmailSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);

		if (persist) {
			localStorage.setItem("userEmail", userLogin.email);
		}

		if (validEmail) {
			setIsLoading(false);
			navigate("/login/password", { state: { from: from }, replace: true });
		}
		// TODO: write else to handle invalid email
	};

	const togglePersist = () => {
		localStorage.setItem("persist", JSON.stringify(!persist));
		setPersist((prev) => !prev);
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
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
						onFocus={() => setEmailFocus(true)}
						onBlur={() => setEmailFocus(false)}
					/>

					<CheckboxField
						label="Remember Me"
						id="login-remember"
						onChange={togglePersist}
						checked={persist}
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
};
