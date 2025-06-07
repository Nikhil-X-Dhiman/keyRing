import { useEffect, useRef, useState } from "react";
import { passwdSchema } from "../utils/authSchema.js";
import { instance } from "../api/axios.js";
import { useAuth } from "../hooks/useAuth.js";
import { Navigate, useNavigate } from "react-router";

export const LoginPasswd = () => {
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);

	const [passwdFocus, setPasswdFocus] = useState(false);
	const passwdRef = useRef();

	const [err, setErr] = useState(undefined);

	const { userLogin, validEmail, validPasswd, setUserLogin, setValidPasswd } =
		useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		passwdRef.current.focus();
	}, []);

	useEffect(() => {
		if (!passwdFocus && userLogin.passwd) {
			const { success, data, error } = passwdSchema.safeParse(userLogin.passwd);
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
	}, [userLogin.passwd]);

	if (!userLogin.email && !validEmail) {
		return <Navigate to="/login/email" replace />;
	}

	const handleSubmitBtn = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (validPasswd && validEmail) {
			// navigate to password page
			try {
				const response = await instance.post(
					"/login",
					{
						email: userLogin.email,
						passwd: userLogin.passwd,
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
			}
		} else if (!validEmail) {
			<Navigate to="/login/email" replace />;
		} else if (!validPasswd) {
			passwdRef.current.focus();
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
				{userLogin.email}
				<form>
					<fieldset>
						<legend>
							Password <span>(required)</span>
						</legend>
						<input
							type="password"
							id="login-passwd"
							ref={passwdRef}
							value={userLogin.passwd}
							onChange={(e) =>
								setUserLogin((prev) => ({ ...prev, passwd: e.target.value }))
							}
							required
							onFocus={() => setPasswdFocus(true)}
							onBlur={() => setPasswdFocus(false)}
						/>
					</fieldset>
					{/* TODO: change hide & unhide using CSS */}
					{err && userLogin.passwd ? <p>{err}</p> : <p></p>}
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
