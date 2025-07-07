/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { emailSchema, nameSchema, passwdSchema } from "../utils/authSchema";
import { instance } from "../api/axios";
import PasswdVisibleOnIcon from "../public/visibility.svg?react";
import PasswdVisibleOffIcon from "../public/visibility-off.svg?react";
import CrossIcon from "../public/cross.svg?react";
import {
	bufferToBase64,
	generateCryptoRandomValue,
} from "../hooks/useCrypto.js";

export const Register = () => {
	const navigate = useNavigate();
	const emailRef = useRef();
	const nameRef = useRef();
	const passwdRef = useRef();
	const confirmRef = useRef();
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

	const [showPasswd, setShowPasswd] = useState(false);
	const [showConfirmPasswd, setShowConfirmPasswd] = useState(false);

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
				} else {
					if (error.response?.status === 409) {
						setErrorMsg("Email Already Exist Or User Creation Failed!!!");
					} else {
						console.error(
							`Server Response: ${error.response?.status}, ${error.response?.data?.msg}`
						);
						setErrorMsg("Something Went Wrong!!!");
						// TODO: Create style for Error Msg
					}
				}
			}
		}
	};

	const handlePasswdVisibility = (e) => {
		e.preventDefault();
		setShowPasswd((prev) => !prev);
	};

	const handleConfirmPasswdVisibility = (e) => {
		e.preventDefault();
		setShowConfirmPasswd((prev) => !prev);
	};

	return (
		<>
			<main className="flex flex-col justify-center items-center pt-15 select-none">
				<figure className="flex flex-col items-center gap-y-2 p-2 select-none">
					<img src="/add-user.png" alt="add-user-img" className="w-23 h-23" />
					<figcaption className="text-xl font-semibold mb-2">
						Create account
					</figcaption>
				</figure>
				{errorMsg}
				<section className="flex flex-col items-center">
					<form
						onSubmit={handleRegisterForm}
						className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md"
					>
						{/* Email Input Field */}
						<fieldset
							className={`w-full px-2 pb-2 mb-2 rounded-md border-1 ${
								emailReq && userRegister.email
									? "border-red-500"
									: "border-gray-400"
							} focus-within:border-blue-500 hover:border-blue-300
					focus-within:hover:border-blue-500 transition-all`}
						>
							<legend className="text-[.8rem] text-gray-400">
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
								className="w-full border-0 focus:outline-0 autofill:bg-gray-800"
							/>
							<div ref={emailRef}>
								{emailReq && userRegister.email ? (
									<div className="flex items-center gap-1 mb-1.5">
										<CrossIcon className="w-3 h-3 font-bold relative bottom-1 text-red-500 shrink-0" />
										<p className="flex items-center gap-1 text-[.7rem] font-semibold text-left text-red-500 mt-1 -mb-1">
											{emailReq}
										</p>
									</div>
								) : (
									<p></p>
								)}
							</div>
						</fieldset>
						{/* Name Input Field */}
						<fieldset
							className={`w-full px-2 pb-2 mb-2 rounded-md border-1 ${
								nameReq && userRegister.name
									? "border-red-500"
									: "border-gray-400"
							} focus-within:border-blue-500 hover:border-blue-300
					focus-within:hover:border-blue-500 transition-all`}
						>
							<legend className="text-[.8rem] text-gray-400">
								Name <span>(required)</span>
							</legend>
							<input
								type="text"
								name="name"
								id="name"
								value={userRegister.name}
								onChange={handleRegisterInput}
								required
								className="w-full border-0 focus:outline-0 autofill:bg-gray-800"
							/>
							<div ref={nameRef}>
								{nameReq && userRegister.name ? (
									<div className="flex items-center gap-1 mb-1.5">
										<CrossIcon className="w-3 h-3 font-bold relative top-1 text-red-500 shrink-0" />
										<p className="flex items-center gap-1 text-[.7rem] font-semibold text-left text-red-500 mt-1 -mb-1">
											{nameReq}
										</p>
									</div>
								) : (
									<p></p>
								)}
							</div>
						</fieldset>
						{/* Passwd Input Field */}
						<fieldset
							className={`w-full px-2 pb-2 mb-2 rounded-md border-1 relative ${
								passwdReq && passwdCompare.passwd
									? "border-red-500"
									: "border-gray-400"
							} focus-within:border-blue-500 hover:border-blue-300
					focus-within:hover:border-blue-500 transition-all`}
						>
							<legend className="text-[.8rem] text-gray-400">
								Password <span>(required)</span>
							</legend>
							<input
								type={showPasswd ? "text" : "password"}
								name="passwd"
								id="passwd"
								value={passwdCompare.passwd}
								onChange={handlePasswdInput}
								required
								className="w-full border-0 focus:outline-0 autofill:bg-gray-800"
							/>
							<button
								onClick={handlePasswdVisibility}
								className="absolute right-4 top-1 cursor-pointer"
							>
								{showPasswd ? (
									<PasswdVisibleOffIcon className="w-4 h-4" />
								) : (
									<PasswdVisibleOnIcon className="w-4 h-4" />
								)}
							</button>
							<div ref={passwdRef}>
								{passwdReq && passwdCompare.passwd ? (
									<div className="flex items-center gap-1 mb-1.5">
										<CrossIcon className="w-3 h-3 font-bold relative bottom-1 text-red-500 shrink-0" />
										<p className="flex items-center gap-1 text-[.7rem] font-semibold text-left text-red-500 mt-1 -mb-1">
											{passwdReq}
										</p>
									</div>
								) : (
									<p></p>
								)}
							</div>
						</fieldset>
						{/* Comfirm Passwd Input Field */}
						<fieldset
							className={`w-full px-2 pb-2 mb-2 rounded-md border-1 relative ${
								confirmPasswdReq && passwdCompare.confirmPasswd
									? "border-red-500"
									: "border-gray-400"
							} focus-within:border-blue-500 hover:border-blue-300
					focus-within:hover:border-blue-500 transition-all`}
						>
							<legend className="text-[.8rem] text-gray-400">
								Confirm Password <span>(required)</span>
							</legend>
							<input
								type={showConfirmPasswd ? "text" : "password"}
								title={
									!passwdCompare.passwd || !validPasswd
										? "Please Enter Valid Password"
										: ""
								}
								name="confirmPasswd"
								id="confirmPasswd"
								value={passwdCompare.confirmPasswd}
								onChange={handlePasswdInput}
								disabled={!passwdCompare.passwd || !validPasswd}
								required
								className={`w-full border-0 focus:outline-0 autofill:bg-gray-800 ${
									!passwdCompare.passwd || !validPasswd
										? "cursor-not-allowed"
										: ""
								}`}
							/>
							<button
								onClick={handleConfirmPasswdVisibility}
								className="absolute right-4 top-1 cursor-pointer"
							>
								{showConfirmPasswd ? (
									<PasswdVisibleOffIcon
										className={`w-4 h-4 ${!validPasswd ? "hidden" : ""}`}
									/>
								) : (
									<PasswdVisibleOnIcon
										className={`w-4 h-4 ${!validPasswd ? "hidden" : ""}`}
									/>
								)}
							</button>
							<div ref={confirmRef}>
								{confirmPasswdReq && passwdCompare.confirmPasswd ? (
									<div className="flex items-center gap-1 mb-1.5">
										<CrossIcon className="w-3 h-3 font-bold relative top-1 text-red-500 shrink-0" />
										<p className="flex items-center gap-1 text-[.7rem] font-semibold text-left text-red-500 mt-1 -mb-1">
											{confirmPasswdReq}
										</p>
									</div>
								) : (
									<p></p>
								)}
							</div>
						</fieldset>
						<button className="bg-blue-400 hover:bg-blue-300 text-slate-800 font-medium py-2 px-4 mt-2 w-full rounded-3xl shadow-md cursor-pointer transition duration-200 ease-in-out">
							Register
						</button>
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
