/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { passwdSchema } from "../../utils/authSchema.js";
import { instance } from "../../api/axios.js";
import { useAuth } from "../../hooks/useAuth.js";
import { Link, Navigate, useNavigate, useLocation } from "react-router";
import { useVerifyAccessToken } from "../../hooks/useVerifyJWT.jsx";
import WaveIcon from "../public/wave.svg?react";
import { base64ToBuffer, useCrypto } from "../../hooks/useCrypto.js";
import { InputField } from "../InputField.jsx";
import { ErrorModal } from "../ErrorModal.jsx";
import { ClockLoader } from "react-spinners";
// import { usePrivateInstance } from "../hooks/usePrivateInstance.jsx";
import { useFetchData } from "../../hooks/useFetchData.js";
import { AuthFormHeader } from "../AuthFormHeader.jsx";
import { Button } from "../Button.jsx";
import { useDB } from "../../hooks/useDB.js";

export const LoginPasswd = () => {
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [loading, setLoading] = useState(false);

	const passwordRef = useRef();
	const errRef = useRef();

	const [inputError, setInputError] = useState("");
	const [pageError, setPageError] = useState("");

	const location = useLocation();
	const navigate = useNavigate();
	const verifyToken = useVerifyAccessToken();
	const { handleAddAppState, handleDBOpen } = useDB();

	// const privateInstance = usePrivateInstance();
	const from = location.state?.from?.pathname || "/user/home";

	const masterSaltRef = useRef("");

	const {
		auth,
		setAuth,
		userLogin,
		validEmail,
		validPasswd: validPassword,
		setUserLogin,
		setValidPasswd,
		publicKey,
		// setPublicKey,
		// setPasswdList,
	} = useAuth();

	const { initialiseCrypto } = useCrypto();

	const { publicKeyRequest, handleFetchList } = useFetchData();

	useEffect(() => {
		passwordRef.current?.focus();
	}, []);

	useEffect(() => {
		errRef.current?.focus();
		setLoading(false);
	}, [inputError]);

	useEffect(() => {
		setLoading(false);
	}, [pageError]);

	useEffect(() => {
		if (userLogin.password) {
			const { success } = passwdSchema.safeParse(userLogin.password);
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
	}, [userLogin.password]);

	// useEffect(() => {
	// 	publicKeyRequest();
	// }, []);

	useEffect(() => {
		const fetchData = async () => {
			if (auth?.masterKey && auth?.accessToken) {
				await handleFetchList();
				const currentUserState = {
					id: 0,
					email: userLogin.email,
					user: auth.user,
					master_salt: masterSaltRef.current,
					access_token: auth.accessToken,
					public_key: publicKey,
					login_status: 1,
				};

				try {
					await handleAddAppState(currentUserState);
				} catch (err) {
					console.error("Failed to save user state to DB", err);
					setPageError("Unable to save user session locally.");
				}
				setLoading(false);
				navigate(from, { replace: true });
			}
		};
		fetchData();
		console.log("here fetch data 4");
	}, [auth?.masterKey]);

	if (!userLogin.email && !validEmail) {
		// Go to Email Login Page if Invalid Email
		return <Navigate to="/login/email" replace />;
	}

	const handleSubmitBtn = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await handleDBOpen();
		} catch (err) {
			console.error("DB Initialization Error:", err);
			setPageError("Something went wrong with app storage. Try again.");
			setLoading(false);
			return;
		}
		if (validPassword && validEmail) {
			try {
				const response = await instance.post("/api/v1/auth/login", userLogin, {
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				});

				const access_token = response.data?.access_token;
				const masterSalt = base64ToBuffer(response.data?.master_salt);
				masterSaltRef.current = response.data?.master_salt;
				if (response.status === 200) {
					setAuth((prev) => ({ ...prev, accessToken: access_token }));

					const { success, payload, error } = await verifyToken(access_token);

					if (success) {
						setAuth((prev) => ({ ...prev, user: payload }));
						await initialiseCrypto(userLogin.password, masterSalt);
						setUserLogin((prev) => ({ ...prev, password: "" }));
						localStorage.setItem("isLogged", JSON.stringify(true));
					} else {
						console.error("Verify Access Token Failed: ", error);
						setPageError("Access Token Verification Failed");
					}
				} else {
					console.error("Client: Request Failed");
					setPageError("Login Failed!!!Try Again");
				}
			} catch (error) {
				if (!error?.response) {
					console.error("No Server Response", error);
					setPageError("No Server Response");
				} else {
					console.error("Server Error: Login Failed!!!: ", error);
					setPageError(error?.response?.data?.msg);
				}
			}
		} else if (!validEmail) {
			console.error("Invalid Email: Redirecting to Email Page");
			setLoading(false);
			navigate("/login/email", { replace: true });
		} else if (!validPassword) {
			setPageError("Incorrect Password!!!");
		}
	};

	const handleErrorModalClose = () => {
		setPageError("");
	};

	return (
		<main className="flex flex-col justify-center items-center pt-15 select-none">
			<ErrorModal
				message={pageError}
				isOpen={pageError}
				onClose={handleErrorModalClose}
			/>
			<AuthFormHeader Icon={WaveIcon} title="Welcome Back" />
			{userLogin.email}
			<form className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md mt-7">
				<InputField
					label="Password"
					required
					type="password"
					showToggle={true}
					ref={passwordRef}
					value={userLogin.password}
					error={inputError}
					onChange={(e) =>
						setUserLogin((prev) => ({ ...prev, password: e.target.value }))
					}
				/>
				<Button
					title="Login in to your account"
					variant="primary"
					onClick={handleSubmitBtn}
					className="flex justify-center items-center gap-2"
				>
					{loading && <ClockLoader size={23} />}
					{loading ? "Processing..." : "Login"}
				</Button>

				<p>or</p>

				<Button
					variant="outline"
					type="reset"
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
	);
};
