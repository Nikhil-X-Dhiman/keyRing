import { useEffect, useRef, useState } from "react";
import { passwdSchema } from "../utils/authSchema.js";
import { instance } from "../api/axios.js";
import { useAuth } from "../hooks/useAuth.js";
import { Navigate, useNavigate } from "react-router";

export const LoginPasswd = () => {
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);

	const [passwd, setPasswd] = useState("");
	const [validPasswd, setValidPasswd] = useState(false);
	const [passwdFocus, setPasswdFocus] = useState(false);
	const passwdRef = useRef();

	const [err, setErr] = useState(undefined);

	const { email } = useAuth();
	const navigate = useNavigate();

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [passwdFocus]);

	useEffect(() => {
		setErr("");
	}, [passwd]);

	if (!email) {
		return <Navigate to="/login/email" replace />;
	}

	const handleSubmitBtn = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (validPasswd) {
			// navigate to password page
			try {
				const response = await instance.post(
					"/login",
					{
						email: "",
						passwd,
					},
					{ withCredentials: true }
				);
				console.log("Axios Response: ", response.data);
			} catch (error) {
				if (!error?.response) {
					console.error("No Server Response");
				} else {
					console.error("Server Error: Login Failed!!!: ", error);
				}
				// console.error("Login Axios Error: ", error);
			}
		}
		setIsLoading(false);
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
		<>
			<main>
				<figure>
					<img src="../public/wave.png" alt="wave-img" />
					<figcaption>Welcome Back</figcaption>
				</figure>
				{/* TODO: Display email address here from global context */}
				{email}
				<form>
					<fieldset>
						<legend>
							Password <span>(required)</span>
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
					<button onClick={handleSubmitBtn}>Continue</button>
				</form>
				<button onClick={() => navigate(-1)}>Go Back</button>
				<div>
					New to Bitwarden? <a href="">Create account</a>
				</div>
			</main>
		</>
	);
};
