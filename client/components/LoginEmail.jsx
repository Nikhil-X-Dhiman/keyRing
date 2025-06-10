/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { emailSchema } from "../utils/authSchema.js";
import { useNavigate, useLocation, replace } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

// TODO: implement use replace and state prop in navigate to use secure login

export const LoginEmail = () => {
	const EMAIL_REGEX =
		/^[a-zA-Z][\w]+([._$%&]?[\w]+)*@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/;
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);
	const location = useLocation();
	const from = location.state?.from?.pathname || "/user/home";

	const [emailFocus, setEmailFocus] = useState(false);
	const emailRef = useRef();

	const [err, setErr] = useState(undefined);

	const navigate = useNavigate();
	const {
		userLogin,
		validEmail,
		defaultUserValues,
		setUserLogin,
		setValidEmail,
	} = useAuth();

	useEffect(() => {
		emailRef.current.focus();
		setValidEmail(false);
		setUserLogin(defaultUserValues);
	}, []);

	useEffect(() => {
		if (!emailFocus && userLogin.email) {
			const { success, data, error } = emailSchema.safeParse(userLogin.email);
			if (success) {
				console.log("Email Schema Success: ", data);
				setValidEmail(true);
				setErr("");
			} else {
				setValidEmail(false);
				console.log(error);

				setErr(error.issues[0].message);
				console.error("Email Schema Error: ", err);
			}
		}
	}, [emailFocus]);

	useEffect(() => {
		setErr("");
	}, [userLogin.email]);

	const handleEmailSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (validEmail) {
			// navigate("/login/password");
			navigate("/login/password", { state: { from: from }, replace: true });
		}
		setIsLoading(false);
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
		<>
			<main>
				<figure>
					<img src="../vault.png" alt="vault-img" />
					<figcaption>Log in to KeyRing</figcaption>
				</figure>
				<form onSubmit={handleEmailSubmit}>
					<fieldset>
						<legend>
							Email address <span>(required)</span>
						</legend>
						<input
							type="email"
							id="login-email"
							ref={emailRef}
							value={userLogin.email}
							// onChange={(e) => setEmail(e.target.value)}
							onChange={(e) =>
								setUserLogin((prev) => ({ ...prev, email: e.target.value }))
							}
							required
							// autoComplete="off"
							onFocus={() => setEmailFocus(true)}
							onBlur={() => setEmailFocus(false)}
						/>
					</fieldset>
					{/* change hide & unhide using CSS */}
					{err && userLogin.email ? <p>{err}</p> : <p></p>}
					<input type="checkbox" id="login-remember" />
					<label htmlFor="login-remember">Remember Email</label>
					<button>Continue</button>
				</form>
				<div>
					New to Bitwarden? <a href="">Create account</a>
				</div>
			</main>
		</>
	);
};
