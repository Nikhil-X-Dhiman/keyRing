/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useVerifyAccessToken } from "../../hooks/useVerifyJWT";
import { useDB } from "../../hooks/useDB";
import {
	bufferToHex,
	generateCryptoRandomValue,
	useCrypto,
} from "../../hooks/useCrypto";
import { passwdSchema } from "../../utils/authSchema";
import { useAuth } from "../../hooks/useAuth";
import { instance } from "../../api/axios";
import WaveIcon from "../../public/wave.svg?react";
import { ErrorModal } from "../ErrorModal";
import { AuthFormHeader } from "../AuthFormHeader";
import { InputField } from "../InputField";
import { Button } from "../Button";
import { ClockLoader } from "react-spinners";
import { Loading } from "./Loading";

const LoginPasswd = () => {
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const location = useLocation();
	const navigate = useNavigate();
	// Custom Hooks
	const { verifyToken } = useVerifyAccessToken();
	const { handleLoginUpdateAppState, handlePutProtectedStateDB } = useDB();
	const { setAuth, setDerivedAuth, masterKey } = useAuth();
	const { initialiseCrypto, handleHashing } = useCrypto();
	// Page States
	const [localLoading, setLocalLoading] = useState(false);
	const [passwordValue, setPasswordValue] = useState("");
	const [validPassword, setValidPassword] = useState(false);
	// Error States
	const [inputError, setInputError] = useState("");
	const [pageError, setPageError] = useState("");
	// Ref for Focus
	const passwordFieldRef = useRef();

	// passed from login email page
	// const from = location.state?.from || "/home";
	const email = location.state?.email || null;
	const persist = location.state?.persist || null;

	useEffect(() => {
		console.log("Password: Password Field Focus Set");
		passwordFieldRef.current?.focus();
	}, []);

	useEffect(() => {
		console.log("Password: Page Error. Loading -> false");
		setLocalLoading(false);
	}, [pageError]);

	useEffect(() => {
		if (passwordValue) {
			const { success } = passwdSchema.safeParse(passwordValue);
			setValidPassword(success);
			setInputError(success && "");
		}
	}, [passwordValue]);

	// Request to Server for Authentication
	const handleSubmitBtn = async (e) => {
		e.preventDefault();
		setLocalLoading(true);
		console.log("Password: Auth Request to Server (Local Loading Started)");

		if (validPassword) {
			try {
				console.log("Password: Auth Request Sending");
				const response = await instance.post(
					"/api/v1/auth/login",
					{ email, password: passwordValue },
					{
						headers: { "Content-Type": "application/json" },
						withCredentials: true,
					}
				);
				const { public_key, access_token, master_salt } = response.data;

				if (response.status === 200) {
					// user auth status state update
					console.log("Password: Request Success");
					setDerivedAuth({ masterSalt: master_salt, publicKey: public_key });
					console.log("Password: Access Token is about to verify");
					const { success, payload, error } = await verifyToken(
						access_token,
						public_key
					);
					if (success) {
						setAuth({ accessToken: access_token, user: payload });
						// creates the masterKey
						console.log("Master Key is Creating");
						const newMasterKey = await initialiseCrypto(
							passwordValue,
							master_salt
						);

						masterKey.current = newMasterKey;
						console.error("Password: MasterKey value: ", masterKey.current);

						try {
							const currentAppState = {
								user: payload,
								master_salt,
								access_token,
								public_key,
								persist,
							};
							// only add state to DB when persist is enable
							console.error("Persist Value: ", persist);
							// debugger;
							if (persist) {
								console.log(
									"Password: States added to the DB (Persist Enabled)"
								);
								// put auth states in localDB
								await handleLoginUpdateAppState(currentAppState);
								// create a hash for local hashing
								let passwordSalt = generateCryptoRandomValue();
								// convert it to hex for text encoding in handleHashing fucntion
								passwordSalt = bufferToHex(passwordSalt);
								// hash the masterpassword
								const masterPasswordHash = await handleHashing(
									passwordValue,
									passwordSalt
								);
								// put the hashed password & mastersalt to localDB
								await handlePutProtectedStateDB({
									passwordHash: masterPasswordHash,
									passwordSalt,
								});
							}
						} catch (err) {
							console.error("Password: Failed to save App state to DB", err);
							setPageError("Password: Failed to save App state to DB");
						}
						console.log("Home Navigation Starts");
						navigate("/home", { replace: true });
					} else {
						console.error("Access Token Verification Failed: ", error);
						setPageError("Access Token Verification Failed");
					}
				} else {
					console.error("Client: Request Failed");
					setPageError("Login Failed!!! Try Again");
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
				setLocalLoading(false);
			}
		} else if (!validPassword) {
			setPageError("Incorrect Password!!!");
		}
	};

	const handleErrorModalClose = () => {
		setPageError("");
	};

	const handleBackBtn = useCallback(() => {
		navigate("/login/email", { replace: true });
	}, []);

	if (!email) {
		return <Navigate to="/login/email" replace />;
	} else if (localLoading) {
		return <Loading loading={localLoading} />;
	}

	return (
		<main className="flex flex-col justify-center items-center pt-15 select-none">
			<ErrorModal
				message={pageError}
				isOpen={pageError}
				onClose={handleErrorModalClose}
			/>
			<AuthFormHeader Icon={WaveIcon} title="Welcome Back" />
			{email}
			<form className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md mt-7">
				<InputField
					label="Password"
					required
					type="password"
					showToggle={true}
					ref={passwordFieldRef}
					value={passwordValue}
					error={inputError}
					onChange={(e) => setPasswordValue(e.target.value)}
				/>
				<Button
					title="Login in to your account"
					variant="primary"
					onClick={handleSubmitBtn}
					className="flex justify-center items-center gap-2"
				>
					<>
						{localLoading && <ClockLoader size={23} />}
						{localLoading ? "Processing..." : "Login"}
					</>
				</Button>

				<p>or</p>

				<Button variant="outline" type="reset" onClick={handleBackBtn}>
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

export default LoginPasswd;
