import { useEffect, useRef, useState } from "react";
import { passwdSchema } from "../utils/authSchema.js";

export const LoginPasswd = () => {
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);

	const [passwd, setPasswd] = useState("");
	const [validPasswd, setValidPasswd] = useState(false);
	const [passwdFocus, setPasswdFocus] = useState(false);
	const passwdRef = useRef();

	const [err, setErr] = useState(undefined);

	useEffect(() => {
		passwdRef.current.focus();
	}, []);

	useEffect(() => {
		if (!passwdFocus && passwd) {
			const { success, data, error } = passwdSchema.safeParse(passwd);
			if (success) {
				console.log("Passwd Schema Success: ", data);
				setValidPasswd(true);
				setErr("");
			} else {
				setValidPasswd(false);
				console.log(error);

				setErr(error.issues[0].message);
				console.error("Passwd Schema Error: ", err);
			}
		}
	}, [passwdFocus]);

	useEffect(() => {
		setErr("");
	}, [passwd]);

	const handleSubmitBtn = (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (validPasswd) {
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
							type="password"
							id="login-passwd"
							ref={passwdRef}
							value={passwd}
							onChange={(e) => setPasswd(e.target.value)}
							required
							onFocus={() => setPasswdFocus(true)}
							onBlur={() => setPasswdFocus(false)}
						/>
					</fieldset>
					{/* change hide & unhide using CSS */}
					{err && passwd ? <p>{err}</p> : <p></p>}
					{/* match passwd input comes here */}
					<button onClick={handleSubmitBtn}>Continue</button>
				</form>
				<div>
					New to Bitwarden? <a href="">Create account</a>
				</div>
			</main>
		</>
	);
};
