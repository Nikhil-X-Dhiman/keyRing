/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { emailSchema, nameSchema, passwdSchema } from "../utils/authSchema";
import { instance } from "../api/axios";
import {
	bufferToBase64,
	generateCryptoRandomValue,
} from "../hooks/useCrypto.js";
import { ErrorModal } from "./ErrorModal.jsx";
import { InputField } from "./InputField.jsx";
import { Button } from "./Button.jsx";
import { AuthFormHeader } from "./AuthFormHeader.jsx";

export const Register = () => {
	const navigate = useNavigate();
	const emailRef = useRef();
	const { userRegister, setUserRegister } = useAuth();

	const [pageError, setPageError] = useState("");
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
				const masterSalt = await bufferToBase64(generateCryptoRandomValue(16));
				console.log("Generated MasterSalt: ", masterSalt);
				const payload = { ...userRegister, masterSalt };
				const response = await instance.post("/api/v1/auth/register", {
					payload,
				});
				setUserRegister((prev) => ({ ...prev, masterSalt }));
				if (response.status === 201) {
					setUserRegister((prev) => ({ ...prev, passwd: "" }));
					navigate("/login/email", { replace: true });
				}
			} catch (error) {
				if (!error?.response) {
					console.error("No Server Response!!!", error);
					setPageError("No Server Response");
				} else {
					if (error.response?.status === 409) {
						setPageError("Email Already Exist Or User Creation Failed!!!");
					} else {
						console.error(
							`Server Response: ${error.response?.status}, ${error.response?.data?.msg}`
						);
						setPageError("Something Went Wrong!!!");
					}
				}
			}
		} else {
			setPageError("Requirements are not met in Registration Form");
		}
	};

	const onClose = () => {
		setPageError("");
	};

	return (
		<>
			<main className="flex flex-col justify-center items-center pt-15 select-none">
				{/* Error Modal */}
				<ErrorModal message={pageError} isOpen={pageError} onClose={onClose} />

				{/* Form Header */}
				<AuthFormHeader
					title="Create Account"
					imgSrc="../src/assets/add-user.png"
					imgAlt="add-user-img"
				/>

				<section className="flex flex-col items-center">
					<form
						onSubmit={handleRegisterForm}
						className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md"
					>
						{/* Email Input Field */}
						<InputField
							label="Email address"
							required
							type="test"
							name="email"
							id="email"
							ref={emailRef}
							value={userRegister.email}
							onChange={handleRegisterInput}
							error={emailReq}
						/>

						{/* Name Input Field */}
						<InputField
							label="Name"
							required
							type="text"
							name="name"
							id="name"
							value={userRegister.name}
							onChange={handleRegisterInput}
							error={nameReq}
						/>

						{/* Passwd Input Field */}
						<InputField
							label="Password"
							required
							name="passwd"
							type="password"
							showToggle={true}
							id="passwd"
							value={passwdCompare.passwd}
							onChange={handlePasswdInput}
							error={passwdReq}
						/>

						{/* Comfirm Passwd Input Field */}
						<InputField
							label="Confirm Password"
							required
							name="confirmPasswd"
							id="confirmPasswd"
							type="password"
							showToggle={validPasswd && passwdCompare.passwd}
							value={passwdCompare.confirmPasswd}
							onChange={handlePasswdInput}
							disabled={!passwdCompare.passwd || !validPasswd}
							error={confirmPasswdReq}
						/>
						<Button>Register</Button>
					</form>
					<div>
						<p>
							Already have an account?{" "}
							<Link
								to="/login/email"
								className="text-blue-300 hover:text-blue-200 hover:underline transition duration-200 ease-in-out"
							>
								Log In
							</Link>
						</p>
					</div>
				</section>
			</main>
		</>
	);
};
