import { useEffect, useRef, useState } from "react";
import { emailSchema } from "../utils/authSchema.js";

export const LoginEmail = () => {
	const EMAIL_REGEX =
		/^[a-zA-Z][\w]+([._$%&]?[\w]+)*@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/;
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);

	const [email, setEmail] = useState("");
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);
	const emailRef = useRef();

	const [err, setErr] = useState(undefined);

	useEffect(() => {
		emailRef.current.focus();
	}, []);

	useEffect(() => {
		if (!emailFocus && email) {
			const { success, data, error } = emailSchema.safeParse(email);
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
	}, [email]);

	const handleSubmitBtn = (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (validEmail) {
			// navigate to password page
		}
		setIsLoading(false);
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
		<>
			<main>
				<figure>
					<img src="../public/vault.png" alt="vault-img" />
					<figcaption>Log in to KeyRing</figcaption>
				</figure>
				<form>
					<fieldset>
						<legend>
							Email address <span>(required)</span>
						</legend>
						<input
							type="email"
							id="login-email"
							ref={emailRef}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							onFocus={() => setEmailFocus(true)}
							onBlur={() => setEmailFocus(false)}
						/>
					</fieldset>
					{/* change hide & unhide using CSS */}
					{err && email ? <p>{err}</p> : <p></p>}
					<input type="checkbox" id="login-remember" />
					<label htmlFor="login-remember">Remember Email</label>
					<button onClick={handleSubmitBtn}>Continue</button>
				</form>
				<div>
					New to Bitwarden? <a href="">Create account</a>
				</div>
			</main>
		</>
	);
};
