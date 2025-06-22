/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { emailSchema, nameSchema, passwdSchema } from "../utils/authSchema";
import { instance } from "../api/axios";

export const Register = () => {
	const navigate = useNavigate();
	const emailRef = useRef();
	const { userRegister, setUserRegister } = useAuth();

	const [errorMsg, setErrorMsg] = useState("");
	const [passwdCompare, setPasswdCompare] = useState({
		passwd: "",
		confirmPasswd: "",
	});

	const [validEmail, setValidEmail] = useState(false);
	const [validName, setValidName] = useState(false);
	const [validPasswd, setValidPasswd] = useState(false);

	const [emailReq, setEmailReq] = useState("");
	const [nameReq, setNameReq] = useState("");
	const [passwdReq, setpasswdReq] = useState("");
	const [confirmPasswdReq, setconfirmPasswdReq] = useState("");

	useEffect(() => {
		emailRef.current?.focus();
	}, []);

	useEffect(() => {
		if (userRegister.email) {
			const { success, error } = emailSchema.safeParse(userRegister.email);

			if (success) {
				setValidEmail(true);
				setEmailReq("");
			} else {
				setValidEmail(false);
				console.error("Email Invalid: ", error);
				setEmailReq(
					'Note: Email must be a-z character, 0-9 Numbers, ".@-" special characters & case-insensitinve'
				);
			}
		}
	}, [userRegister.email]);

	useEffect(() => {
		if (userRegister.name) {
			const { success, error } = nameSchema.safeParse(userRegister.name);

			if (success) {
				setValidName(true);
				setNameReq("");
			} else {
				setValidName(false);
				console.error("Name Invalid: ", error);
				setNameReq("Note: Name length allowed between 2 & 32");
			}
		}
	}, [userRegister.name]);

	useEffect(() => {
		if (passwdCompare.passwd || passwdCompare.confirmPasswd) {
			const { success, error } = passwdSchema.safeParse(passwdCompare.passwd);
			if (success) {
				setValidPasswd(true);
				setpasswdReq("");
			} else {
				setValidPasswd(false);
				console.error("Password Error: ", error);
				setpasswdReq(
					"Note: Password must contain a-z, A-Z, 0-9, (*#@!$%&) & atleast 8 characters long"
				);
			}
			if (
				passwdCompare.confirmPasswd &&
				passwdCompare.confirmPasswd !== passwdCompare.passwd
			) {
				setconfirmPasswdReq("Note: Password Does Not Match");
				setUserRegister((prev) => ({ ...prev, passwd: "" }));
			} else if (
				passwdCompare.confirmPasswd &&
				passwdCompare.confirmPasswd === passwdCompare.passwd
			) {
				setconfirmPasswdReq("");
				setUserRegister((prev) => ({ ...prev, passwd: passwdCompare.passwd }));
			}
		}
	}, [passwdCompare.passwd, passwdCompare.confirmPasswd]);

	const handleRegisterInput = (e) => {
		const { name, value } = e.target;
		setUserRegister((prev) => ({ ...prev, [name]: value }));
	};

	const handlePasswdInput = (e) => {
		const { name, value } = e.target;
		setPasswdCompare((prev) => ({ ...prev, [name]: value }));
	};

	const handleRegisterForm = async (e) => {
		e.preventDefault();
		if (validEmail && validName && validPasswd && !confirmPasswdReq) {
			try {
				const response = await instance.post(
					"/api/v1/auth/register",
					userRegister
				);
				if (response.status === 201) {
					setUserRegister((prev) => ({ ...prev, passwd: "" }));
					navigate("/login/email", { replace: true });
				}
			} catch (error) {
				if (!error?.response) {
					console.error("No Server Response!!!");
				} else {
					if (error.response.status === 409) {
						setErrorMsg("Email Already Exist!!!");
					} else {
						console.error(`Server Response: ${error.response.status}`);
						// console.error("Something Went Wrong!!!");
						setErrorMsg("Something Went Wrong!!!");
					}
				}
			}
		}
	};

	return (
		<>
			<main>
				<section>
					<figure>
						<img src="/add-user.png" alt="add-user-img" />
						<figcaption>Create account</figcaption>
					</figure>
				</section>
				{errorMsg}
				<section>
					<form onSubmit={handleRegisterForm}>
						<fieldset>
							<legend>
								Email address <span>(required)</span>
							</legend>
							<input
								type="text"
								name="email"
								id="email"
								ref={emailRef}
								value={userRegister.email}
								onChange={handleRegisterInput}
								required
							/>
							{emailReq}
						</fieldset>
						<fieldset>
							<legend>Name</legend>
							<input
								type="text"
								name="name"
								id="name"
								value={userRegister.name}
								onChange={handleRegisterInput}
							/>
							{nameReq}
						</fieldset>
						<fieldset>
							<legend>
								Password <span>(required)</span>
							</legend>
							<input
								type="password"
								name="passwd"
								id="passwd"
								value={passwdCompare.passwd}
								onChange={handlePasswdInput}
								required
							/>
							{passwdReq}
						</fieldset>
						<fieldset>
							<legend>
								Confirm Password <span>(required)</span>
							</legend>
							<input
								type="password"
								name="confirmPasswd"
								id="confirmPasswd"
								value={passwdCompare.confirmPasswd}
								onChange={handlePasswdInput}
								disabled={!passwdCompare.passwd || !validPasswd}
								required
							/>
							{confirmPasswdReq}
						</fieldset>
						<div>
							<button>Register</button>
						</div>
					</form>
					<div>
						<p>
							Already have an account? <Link to="/login/email">Log In</Link>
						</p>
					</div>
				</section>
			</main>
		</>
	);
};
