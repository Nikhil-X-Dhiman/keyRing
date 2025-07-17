/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { passwdSchema } from "../utils/authSchema.js";
import { instance, privateInstance } from "../api/axios.js";
import { useAuth } from "../hooks/useAuth.js";
import { Link, Navigate, useNavigate, useLocation } from "react-router";
import { useVerifyAccessToken } from "../hooks/useVerifyJWT.jsx";
import WaveIcon from "../public/wave.svg?react";
import PasswdVisibleOnIcon from "../public/visibility.svg?react";
import PasswdVisibleOffIcon from "../public/visibility-off.svg?react";
import CrossIcon from "../public/cross.svg?react";
import { base64ToBuffer, useCrypto } from "../hooks/useCrypto.js";
import { InputField } from "./InputField.jsx";

export const LoginPasswd = () => {
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);
	const [showPasswd, setShowPasswd] = useState(false);

	const passwdRef = useRef();
	const errRef = useRef();

	const [inputError, setInputError] = useState("");
	const [pageError, setPageError] = useState("");

	// const [err, setErr] = useState(undefined);
	const [maidenInput, setMaidenInput] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const verifyToken = useVerifyAccessToken();
	const from = location.state?.from?.pathname || "/user/home";

	const {
		setAuth,
		userLogin,
		validEmail,
		validPasswd,
		setUserLogin,
		setValidPasswd,
		setPublicKey,
	} = useAuth();

	const { initialiseCrypto } = useCrypto();

	useEffect(() => {
		passwdRef.current?.focus();
	}, []);

	useEffect(() => {
		errRef.current?.focus();
	}, [inputError]);

	useEffect(() => {
		setMaidenInput(true);
		if (userLogin.passwd) {
			const { success } = passwdSchema.safeParse(userLogin.passwd);
			// success, error & data
			if (success) {
				setValidPasswd(true);
				setInputError("");
			} else {
				setValidPasswd(false);
			}
		} else {
			setInputError("");
		}
	}, [userLogin.passwd]);

	useEffect(() => {
		async function publicKeyRequest() {
			// Fetch Public Key to Verify Access Token
			try {
				const response = await instance.get("/api/v1/auth/public");
				if (response.status === 200) {
					setPublicKey(response.data.publicKey);
					// console.log("Public Key: ", response.data.publicKey);
				} else if (response.status === 204) {
					console.log("Public Key: Not Found!!!");
					setPageError("Public Key Not Found");
				}
			} catch (error) {
				console.error("Public Key: Unable to send or receive data", error);
				setPageError("Unable to retrieve data");
			}
		}
		publicKeyRequest();
	}, []);

	if (!userLogin.email && !validEmail) {
		// Go to Email Login Page if Invalid Email
		return <Navigate to="/login/email" replace />;
	}

	const handleSubmitBtn = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (validPasswd && validEmail) {
			try {
				const response = await privateInstance.post(
					"/api/v1/auth/login",
					userLogin
				);

				const access_token = response.data?.access_token;
				const masterSalt = base64ToBuffer(response.data?.master_salt);

				if (response.status === 200) {
					setAuth((prev) => ({ ...prev, accessToken: access_token }));

					const { isValid, payload, error } = await verifyToken(access_token);

					if (isValid) {
						setAuth((prev) => ({ ...prev, user: payload }));
						await initialiseCrypto(userLogin.passwd, masterSalt);
						setUserLogin((prev) => ({ ...prev, passwd: "" }));
						localStorage.setItem("isLogged", JSON.stringify(true));
						navigate(from, { replace: true });
					} else {
						console.error("Verify Access Token Failed: ", error);
						setPageError("Access Token Verification Failed");
					}
				} else {
					console.error("Client: Request Failed");
					setPageError("Unable to Complete the Task");
				}
			} catch (error) {
				if (!error?.response) {
					console.error("No Server Response", error);
					setPageError("No Server Response");
				} else {
					console.error("Server Error: Login Failed!!!: ", error);
					setPageError(error?.response?.data?.msg);
				}
			} finally {
				setUserLogin((prev) => ({ ...prev, passwd: "" }));
				setIsLoading(false);
			}
		} else if (!validEmail) {
			console.error("Invalid Email: Redirecting to Email Page");
			navigate("/login/email", { replace: true });
		} else if (!validPasswd) {
			setPageError("Incorrect Password!!!");
		}
		setIsLoading(false);
	};

	const handlePasswdVisibility = (e) => {
		e.preventDefault();
		setShowPasswd((prev) => !prev);
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
		<>
			<main className="flex flex-col justify-center items-center pt-15 select-none">
				<figure className="flex flex-col items-center gap-y-2 p-2 select-none text-white">
					<WaveIcon className="w-26 h-26 text-light-grey scale-x-[-1]" />
					<figcaption className="text-xl font-semibold">
						Welcome Back
					</figcaption>
				</figure>
				{userLogin.email}
				<form className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md mt-7">
					<fieldset
						className={`w-full px-2 pb-2 rounded-md border-1 ${
							inputError && maidenInput ? "border-red-500" : "border-gray-400"
						} focus-within:border-blue-500 hover:border-blue-300
					focus-within:hover:border-blue-500 transition-all relative `}
					>
						<legend className="text-[.8rem] text-gray-400">
							Password <span>(required)</span>
						</legend>
						<input
							type={showPasswd ? "text" : "password"}
							id="login-passwd"
							ref={passwdRef}
							value={userLogin.passwd}
							onChange={(e) =>
								setUserLogin((prev) => ({ ...prev, passwd: e.target.value }))
							}
							required
							className="w-full border-0 focus:outline-0 autofill:bg-gray-800 relative"
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
					</fieldset>
					<InputField
						label="Password"
						required
						type="password"
						showToggle={true}
						ref={passwdRef}
						value={userLogin.passwd}
						error={inputError}
						onChange={(e) =>
							setUserLogin((prev) => ({ ...prev, passwd: e.target.value }))
						}
					/>
					<div className="" ref={errRef}>
						{inputError && maidenInput ? (
							<p className="flex items-center gap-1 text-[.7rem] font-semibold text-left text-red-500 mt-1 -mb-1">
								<CrossIcon className="w-3 h-3 font-bold" />
								{inputError}
							</p>
						) : (
							<p></p>
						)}
					</div>
					<button
						type="button"
						className="bg-blue-400 hover:bg-blue-300 text-slate-800 font-medium py-2 px-4 w-full rounded-3xl cursor-pointer shadow-md transition duration-200 ease-in-out mt-2"
						onClick={handleSubmitBtn}
					>
						Login
					</button>
					<p>or</p>
					<button
						className="border-2 border-blue-400 hover:bg-blue-400 text-blue-400 hover:text-slate-800 font-medium py-2 px-4 w-full rounded-3xl cursor-pointer shadow-md transition duration-200 ease-in-out"
						onClick={() => navigate("/login/email")}
					>
						Back
					</button>
				</form>

				<div>
					New to keyRing?{" "}
					<Link
						to="/register"
						className="text-blue-300 hover:text-blue-200 hover:underline transition duration-200 ease-in-out"
					>
						Create account
					</Link>
				</div>
			</main>
		</>
	);
};
