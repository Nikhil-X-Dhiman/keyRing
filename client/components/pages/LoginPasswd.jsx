/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useVerifyAccessToken } from "../../hooks/useVerifyJWT";
import { useDB } from "../../hooks/useDB";
import { base64ToBuffer, useCrypto } from "../../hooks/useCrypto";
import { useFetchData } from "../../hooks/useFetchData";
import { passwdSchema } from "../../utils/authSchema";
import { useAuth } from "../../hooks/useAuth";
import { instance } from "../../api/axios";
import WaveIcon from "../../public/wave.svg?react";
import { ErrorModal } from "../ErrorModal";
import { AuthFormHeader } from "../AuthFormHeader";
import { InputField } from "../InputField";
import { Button } from "../Button";
import { ClockLoader } from "react-spinners";
import { useApp } from "../../hooks/useApp";

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
	const { handleLoginUpdateAppState } = useDB();

	// const privateInstance = usePrivateInstance();
	const from = location.state?.from?.pathname || "/user/home";

	const masterSaltRef = useRef("");
	const userRef = useRef({});
	const accessTokenRef = useRef("");
	const publicKeyRef = useRef("");

	const {
		auth,
		setAuth,
		userLogin,
		validEmail,
		validPasswd: validPassword,
		setUserLogin,
		setValidPasswd,
	} = useAuth();

	const { appState, setAppState } = useApp();

	const { initialiseCrypto } = useCrypto();

	const { handleFetchList } = useFetchData();

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
			setValidPasswd(success);
			setInputError(success && "");
		}
	}, [userLogin.password]);

	// useEffect(() => {
	// 	publicKeyRequest();
	// }, []);

	useEffect(() => {
		const fetchData = async () => {
			console.log("Passwd: Data Fetching Function Started");
			if (auth?.masterKey && auth?.user) {
				const currentUserState = {
					email: userLogin.email,
					user: userRef.current,
					master_salt: masterSaltRef.current,
					access_token: accessTokenRef.current,
					public_key: publicKeyRef.current,
					login_status: true,
				};

				try {
					// only add state to db when persist is enable
					if (appState.persist) {
						console.log("Passwd: States added to the DB as persist is enable");
						await handleLoginUpdateAppState(currentUserState);
						console.log("Is it running???");
					}
					console.log("Passwd: Data Fetching Started");
					await handleFetchList();
				} catch (err) {
					console.error("Failed to fetch data", err);
					setPageError("Failed to Fetch Data.");
				}
				setAppState((prev) => ({ ...prev, login: true }));
				setLoading(false);
				console.log("Passwd: Loading is finished...Go to Home");

				navigate("/user/home", { replace: true });
			}
		};
		fetchData();
		console.log("here fetch data 4");
	}, [auth?.masterKey]);

	// if (!userLogin.email && !validEmail) {
	// 	// Go to Email Login Page if Invalid Email
	// 	return <Navigate to="/login/email" replace />;
	// }

	const handleSubmitBtn = async (e) => {
		e.preventDefault();
		console.log("Passwd: Loading Started");

		setLoading(true);
		if (validPassword && validEmail) {
			try {
				console.log("Passwd: Login Request Sent");
				const response = await instance.post("/api/v1/auth/login", userLogin, {
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				});
				publicKeyRef.current = response.data?.public_key;
				accessTokenRef.current = response.data?.access_token;
				masterSaltRef.current = base64ToBuffer(response.data?.master_salt);
				if (response.status === 200) {
					// user auth status state update
					setAuth((prev) => ({
						...prev,
						publicKey: publicKeyRef.current,
					}));
					console.log("Passwd: Access Token is verified");
					const { success, payload, error } = await verifyToken(
						accessTokenRef.current,
						publicKeyRef.current
					);
					userRef.current = payload;
					if (success) {
						setAuth((prev) => ({
							...prev,
							user: payload,
							accessToken: accessTokenRef.current,
							masterSalt: masterSaltRef.current,
						}));
						// creates the masterKey
						console.log("Master Key is Created");

						await initialiseCrypto(userLogin.password, masterSaltRef.current);
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
			navigate("/login/email", { replace: true });
			setLoading(false);
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
