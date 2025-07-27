/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { emailSchema, nameSchema, passwdSchema } from "../../utils/authSchema";
import {
	bufferToBase64,
	generateCryptoRandomValue,
} from "../../hooks/useCrypto";
import { instance } from "../../api/axios";
import { ErrorModal } from "../ErrorModal";
import { AuthFormHeader } from "../AuthFormHeader";
import { InputField } from "../InputField";
import { Button } from "../Button";

const Register = () => {
	const navigate = useNavigate();

	const [emailValue, setEmailValue] = useState("");
	const [usernameValue, setUsernameValue] = useState("");
	const [passwordValue, setPasswordValue] = useState("");
	const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

	const [validEmail, setValidEmail] = useState(false);
	const [validUserName, setValidUserName] = useState(false);
	const [validPassword, setValidPassword] = useState(false);
	const [matchPassword, setMatchPassword] = useState(false);

	const [pageError, setPageError] = useState("");

	const [emailReq, setEmailReq] = useState("");
	const [userNameReq, setUserNameReq] = useState("");
	const [passwordReq, setPasswordReq] = useState("");
	const [confirmPasswordReq, setconfirmPasswordReq] = useState("");

	const emailFieldRef = useRef();

	useEffect(() => {
		emailFieldRef.current?.focus();
	}, []);

	useEffect(() => {
		if (emailValue) {
			const { success, error } = emailSchema.safeParse(emailValue);
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
	}, [emailValue]);

	useEffect(() => {
		if (usernameValue) {
			const { success, error } = nameSchema.safeParse(usernameValue);

			if (success) {
				setValidUserName(true);
				setUserNameReq("");
			} else {
				setValidUserName(false);
				console.error("Name Invalid: ", error);
				setUserNameReq("Note: Name length allowed between 2 & 32");
			}
		}
	}, [usernameValue]);

	useEffect(() => {
		if (passwordValue || confirmPasswordValue) {
			const { success, error } = passwdSchema.safeParse(passwordValue);
			if (success) {
				setValidPassword(true);
				setPasswordReq("");
			} else {
				setValidPassword(false);
				console.error("Password Error: ", error);
				setPasswordReq(
					"Note: Password must contain a-z, A-Z, 0-9, (*#@!$%&) & atleast 8 characters long"
				);
			}
			if (confirmPasswordValue && confirmPasswordValue !== passwordValue) {
				setconfirmPasswordReq("Note: Password Does Not Match");
				setMatchPassword(false);
			} else if (
				confirmPasswordValue &&
				confirmPasswordValue === passwordValue
			) {
				setconfirmPasswordReq("");
				setMatchPassword(true);
			}
		}
	}, [passwordValue, confirmPasswordValue]);

	const handleEmailInput = useCallback((e) => {
		setEmailValue(e.target.value);
	}, []);

	const handleUserNameInput = useCallback((e) => {
		setUsernameValue(e.target.value);
	}, []);

	const handlePasswordInput = useCallback((e) => {
		setPasswordValue(e.target.value);
	}, []);

	const handleConfirmPasswordInput = useCallback((e) => {
		setConfirmPasswordValue(e.target.value);
	}, []);

	const handleRegisterForm = async (e) => {
		e.preventDefault();
		console.log("Register: Form Submission Starts");

		if (validEmail && validUserName && validPassword && matchPassword) {
			try {
				// generate salt & convert it so it can travel through network
				const masterSalt = await bufferToBase64(generateCryptoRandomValue(16));
				console.log("Generated MasterSalt: ", masterSalt);
				const payload = {
					email: emailValue,
					username: usernameValue,
					password: passwordValue,
					masterSalt,
				};
				const response = await instance.post("/api/v1/auth/register", {
					payload,
				});
				if (response.status === 201) {
					navigate("/login/email", {
						state: { email: emailValue },
						replace: true,
					});
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

	const onClose = useCallback(() => {
		setPageError("");
	}, []);

	return (
		<>
			<main className="flex flex-col justify-center items-center pt-15 pb-5 select-none overflow-y-auto">
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
							type="text"
							name="email"
							id="email"
							ref={emailFieldRef}
							value={emailValue}
							touched={!validEmail}
							onChange={handleEmailInput}
							error={emailReq}
						/>

						{/* Name Input Field */}
						<InputField
							label="Name"
							required
							type="text"
							name="username"
							id="username"
							value={usernameValue}
							touched={!validUserName}
							onChange={handleUserNameInput}
							error={userNameReq}
						/>

						{/* Passwd Input Field */}
						<InputField
							label="Password"
							required
							name="password"
							type="password"
							showToggle={true}
							id="password"
							value={passwordValue}
							touched={!validPassword}
							onChange={handlePasswordInput}
							error={passwordReq}
						/>

						{/* Comfirm Passwd Input Field */}
						<InputField
							label="Confirm Password"
							required
							name="confirmPassword"
							id="confirmPassword"
							type="password"
							showToggle={validPassword && confirmPasswordValue}
							value={confirmPasswordValue}
							touched={!matchPassword}
							onChange={handleConfirmPasswordInput}
							disabled={!passwordValue || !validPassword}
							error={confirmPasswordReq}
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

export default Register;
