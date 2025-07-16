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
import { ErrorModal } from "./ErrorModal.jsx";
import { Button } from "./Button.jsx";
import { AuthFormHeader } from "./AuthFormHeader.jsx";

export const LoginPasswd = () => {
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);

	const passwdRef = useRef();
	const errRef = useRef();

	const [inputError, setInputError] = useState("");
	const [pageError, setPageError] = useState("");

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
		console.log("Error: ", inputError);

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
		console.log("Passwd: ", userLogin.passwd);
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
		} else if (!userLogin.passwd) {
			setPageError("Password is Required");
		} else {
			setPageError("Incorrect Password!!!");
		}
		setIsLoading(false);
	};

	const onClose = () => {
		setPageError("");
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
		<>
			<main className="flex flex-col justify-center items-center pt-15 select-none">
				<ErrorModal isOpen={pageError} message={pageError} onClose={onClose} />

				<AuthFormHeader title="Welcome Back" Icon={WaveIcon} />

				<p className="font-light">{userLogin.email}</p>

				<form
					onSubmit={handleSubmitBtn}
					className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md mt-7"
				>
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

					<Button type="submit" variant="primary">
						Login
					</Button>

					<p>or</p>

					<Button
						type="button"
						variant="outline"
						onClick={() => navigate("/login/email")}
					>
						Back
					</Button>
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
