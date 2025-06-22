/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { emailSchema, nameSchema, passwdSchema } from "../utils/authSchema";
import { useAuth } from "../hooks/useAuth";
import { instance } from "../api/axios";
import { useNavigate } from "react-router";

export const Register = () => {
	const [isLoading, setIsLoading] = useState(false);
	// Email States
	const [validEmail, setValidEmail] = useState(false);
	const emailFocusRef = useRef();
	const [emailFocus, setEmailFocus] = useState(false);

	// Name States
	const [validName, setValidName] = useState("");
	const [nameFocus, setNameFocus] = useState(false);

	// Password States
	const [passwd, setPasswd] = useState("");
	const [passwdFocus, setPasswdFocus] = useState(false);
	const [matchPasswd, setMatchPasswd] = useState("");
	const [matchPasswdFocus, setMatchPasswdFocus] = useState(false);
	const [validPasswd, setValidPasswd] = useState(false);
	const [passwdMatching, setPasswdMatching] = useState(false);

	// Error States
	const [err, setErr] = useState("");
	const [emailError, setEmailError] = useState("");
	const [nameError, setNameError] = useState("");
	const [passwdError, setPasswdError] = useState("");
	const [matchPasswdError, setMatchPasswdError] = useState("");

	const { userRegister, setUserRegister } = useAuth();

	const navigate = useNavigate();

	useEffect(() => {
		emailFocusRef?.current?.focus();
	}, []);

	useEffect(() => {
		if (userRegister.email) {
			const { success, error } = emailSchema.safeParse(userRegister.email);

			if (success) {
				setValidEmail(true);
				setErr("");
			} else {
				setValidEmail(false);
				setErr(error.issues[0].message);
			}
		}
	}, [userRegister.email]);

	useEffect(() => {
		if (!validEmail && !emailFocus && userRegister.email) {
			setEmailError(
				'Email must be a-z character, 0-9 Numbers, ".@-" special characters & case-insensitinve'
			);
		} else if (validEmail) {
			setEmailError(null);
		}
	}, [validEmail, emailFocus]);

	// Name Checking
	useEffect(() => {
		if (userRegister.name) {
			const { success, error } = nameSchema.safeParse(userRegister.name);

			if (success) {
				setValidName(true);
				setErr("");
			} else {
				setValidName(false);
				setErr(error.issues[0].message);
			}
		}
	}, [userRegister.name]);

	useEffect(() => {
		if (!validName && !nameFocus && userRegister.name) {
			setNameError("Name length should be between 2 & 32.");
		} else if (validName) {
			setNameError(null);
		}
	}, [validName, nameFocus]);

	// Password & Password Match Checking
	useEffect(() => {
		if (passwd) {
			const { success, error } = passwdSchema.safeParse(passwd);

			if (success) {
				console.log("Password Success");

				setValidPasswd(true);
				if (passwd === matchPasswd) {
					console.log("inside match password success");

					userRegister.passwd = passwd;
					setPasswdMatching(true);
				}
				setErr("");
			} else {
				console.log("Password Error");

				setValidPasswd(false);
				setErr(error.issues[0].message);
			}

			if (passwd !== matchPasswd) {
				userRegister.passwd = "";
				setPasswdMatching(false);
			}
		}
	}, [passwd, matchPasswd]);

	useEffect(() => {
		if (!validPasswd && !passwdFocus && passwd) {
			console.log("hit pass error");

			setPasswdError(
				"Password must contain a-z, A-Z, 0-9, (*#@!$%&) & atleast 8 characters long"
			);
		} else if (validPasswd) {
			setPasswdError("");
		}
	}, [validPasswd, passwdFocus]);

	useEffect(() => {
		if (matchPasswd && !passwdMatching) {
			setMatchPasswdError("Password does not match!!!");
		} else if (passwdMatching) {
			setMatchPasswdError("");
		}
	}, [passwdMatching, matchPasswd, matchPasswdFocus]);

	// Handles Request & Response to/from the Server
	const handleRegisterSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (validPasswd && validName && validEmail && passwdMatching) {
				console.log("Register: Response Started");
				const response = await instance.post(
					"/api/v1/auth/register",
					userRegister
				);
				console.log("Register Response: ", response);
				if (response.status === 201) {
					console.log("User Register Success");
					navigate("/login/email", { replace: true });
				}
			} else {
				console.error("Client: Request Failed");
			}
		} catch (error) {
			if (!error?.response) {
				console.error("Register: No Server Response");
			} else {
				console.error("Register: Something Went Wrong(Server Side)!!!");
			}
		}
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
		<main>
			<figure>
				<img src="../public/add-user.png" alt="add-user-img" />
				<figcaption>Create account</figcaption>
			</figure>
			<form onSubmit={handleRegisterSubmit}>
				<fieldset>
					<legend>
						Email address <span>(required)</span>
					</legend>
					<input
						type="email"
						id="register-email"
						ref={emailFocusRef}
						value={userRegister.email}
						onChange={(e) =>
							setUserRegister((prev) => ({
								...prev,
								email: e.target.value,
							}))
						}
						onFocus={() => setEmailFocus(true)}
						onBlur={() => setEmailFocus(false)}
					/>
					{emailError || ""}
				</fieldset>
				<fieldset>
					<legend>Name</legend>
					<input
						type="text"
						id="register-name"
						value={userRegister.name}
						onChange={(e) =>
							setUserRegister((prev) => ({
								...prev,
								name: e.target.value,
							}))
						}
						onFocus={() => setNameFocus(true)}
						onBlur={() => setNameFocus(false)}
					/>
					{nameError || ""}
				</fieldset>
				<fieldset>
					<legend>
						Password <span>(required)</span>
					</legend>
					<input
						type="password"
						id="register-passwd"
						value={passwd}
						onChange={(e) => setPasswd(e.target.value)}
						onFocus={() => setPasswdFocus(true)}
						onBlur={() => setPasswdFocus(false)}
					/>
					{passwdError || ""}
				</fieldset>
				<fieldset>
					<legend>
						Confirm Password <span>(required)</span>
					</legend>
					<input
						type="password"
						id="register-match-passwd"
						value={matchPasswd}
						onChange={(e) => setMatchPasswd(e.target.value)}
						onFocus={() => setMatchPasswdFocus(true)}
						onBlur={() => setMatchPasswdFocus(false)}
					/>
					{matchPasswdError || ""}
				</fieldset>
				<button>Continue</button>
			</form>
		</main>
	);
};
