/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { emailSchema } from "../utils/authSchema.js";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

export const LoginEmail = () => {
	const EMAIL_REGEX =
		/^[a-zA-Z][\w]+([._$%&]?[\w]+)*@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/;
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);
	const location = useLocation();
	const from = location.state?.from?.pathname || "/user/home";
	const navigate = useNavigate();

	const [emailFocus, setEmailFocus] = useState(false);
	const emailRef = useRef();

	const [err, setErr] = useState("");

	const {
		userLogin,
		validEmail,
		defaultUserValues,
		setUserLogin,
		setValidEmail,
		persist,
		setPersist,
	} = useAuth();

	useEffect(() => {
		emailRef.current?.focus();
		setValidEmail(false);
		setUserLogin(defaultUserValues);
	}, []);

	useEffect(() => {
		// if (!emailFocus && userLogin.email) {
		if (userLogin.email) {
			const { success, error } = emailSchema.safeParse(userLogin.email);
			if (success) {
				setValidEmail(true);
				setErr("");
			} else {
				setValidEmail(false);
				console.log(error);

				setErr(
					'Email must contain username, "@" & domain name. Characters Allowed are [a-z], [0-9] & [ ._$%& ]'
				);
			}
		}
	}, [emailFocus, userLogin.email]);

	useEffect(() => {
		if (validEmail === true) {
			setErr("");
		}
	}, [validEmail]);

	const handleEmailSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);
		console.log("Emter submission");

		if (validEmail) {
			navigate("/login/password", { state: { from: from }, replace: true });
		}
		setIsLoading(false);
	};

	const togglePersist = () => {
		localStorage.setItem("persist", JSON.stringify(!persist));
		setPersist((prev) => !prev);
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
		<>
			<main>
				<figure>
					<img src="/vault.png" alt="vault-img" />
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
							onChange={(e) =>
								setUserLogin((prev) => ({ ...prev, email: e.target.value }))
							}
							required
							onFocus={() => setEmailFocus(true)}
							onBlur={() => setEmailFocus(false)}
						/>
					</fieldset>
					{/* change hide & unhide using CSS */}
					{err && userLogin.email ? <p>{err}</p> : <p></p>}
					<input
						type="checkbox"
						id="login-remember"
						onChange={togglePersist}
						checked={persist}
					/>
					<label htmlFor="login-remember">Remember Me</label>
					<button disabled={!validEmail}>Continue</button>
				</form>
				<div>
					New to Bitwarden? <Link to="/register">Create Account</Link>
				</div>
			</main>
		</>
	);
};
