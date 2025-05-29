import { useEffect, useRef, useState } from "react";
import { emailSchema } from "../utils/authSchema.js";

export const Home = () => {
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
	const [success, setSuccess] = useState(false);
	const errRef = useRef();

	useEffect(() => {
		emailRef.current.focus();
	}, []);

	useEffect(() => {
		const { success, data, error } = emailSchema.safeParse(email);
		if (success) {
			console.log("Email Schema Success: ", data);
			setValidEmail(true);
		} else {
			setValidEmail(false);
			setErr(error);
			console.error("Email Schema Error: ", err);
		}
	}, [email]);

	useEffect(() => {
		setErr("");
	}, [email]);

	const handleSubmitBtn = (e) => {
		setIsLoading(true);
		e.preventDefault();
		setEmail(data);
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
					<p className={err && email && !validEmail ? "errMsg" : "hide"}>
						{err}
					</p>
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
