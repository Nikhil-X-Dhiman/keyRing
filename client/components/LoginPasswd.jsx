/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { passwdSchema } from "../utils/authSchema.js";
import { instance } from "../api/axios.js";
import { useAuth } from "../hooks/useAuth.js";
import { Link, Navigate, useNavigate, useLocation } from "react-router";
import { useVerifyAccessToken } from "../hooks/useVerifyJWT.jsx";
import WaveIcon from "../public/wave.svg?react";
import { base64ToBuffer, useCrypto } from "../hooks/useCrypto.js";
import { InputField } from "./InputField.jsx";
import { ErrorModal } from "./ErrorModal.jsx";
import { ClockLoader } from "react-spinners";
// import { usePrivateInstance } from "../hooks/usePrivateInstance.jsx";
import { useFetchData } from "../hooks/useFetchData";
import { AuthFormHeader } from "./AuthFormHeader.jsx";
import { Button } from "./Button.jsx";
import { useDB } from "../hooks/useDB.js";

export const LoginPasswd = () => {
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [loading, setLoading] = useState(false);

	const passwdRef = useRef();
	const errRef = useRef();

	const [inputError, setInputError] = useState("");
	const [pageError, setPageError] = useState("");

	const location = useLocation();
	const navigate = useNavigate();
	const verifyToken = useVerifyAccessToken();
	// const privateInstance = usePrivateInstance();
	const from = location.state?.from?.pathname || "/user/home";

	const {
		auth,
		setAuth,
		userLogin,
		validEmail,
		validPasswd,
		setUserLogin,
		setValidPasswd,
		// setPublicKey,
		// setPasswdList,
	} = useAuth();

	const { initialiseCrypto } = useCrypto();

	const { publicKeyRequest, handleFetchList } = useFetchData();

	useEffect(() => {
		passwdRef.current?.focus();
	}, []);

	useEffect(() => {
		errRef.current?.focus();
		setLoading(false);
	}, [inputError]);

	useEffect(() => {
		setLoading(false);
	}, [pageError]);

	useEffect(() => {
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
		// async function publicKeyRequest() {
		// 	// Fetch Public Key to Verify Access Token
		// 	try {
		// 		const response = await instance.get("/api/v1/auth/public");
		// 		if (response.status === 200) {
		// 			await setPublicKey(response.data.publicKey);
		// 		} else if (response.status === 204) {
		// 			console.error("Public Key: Not Found!!!");
		// 			setPageError("Public Key Not Found");
		// 		}
		// 	} catch (error) {
		// 		console.error("Public Key: Unable to send or receive data", error);
		// 		setPageError("Unable to retrieve data");
		// 	}
		// }
		// publicKeyRequest();
		publicKeyRequest();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			if (auth?.masterKey && auth?.accessToken) {
				// const handleFetchData = async () => {
				// 	try {
				// 		const response = await privateInstance.get("/api/v1/all");

				// 		const { success, result } = response.data;
				// 		if (success) {
				// 			const updatedListPromises = result.map(async (item) => {
				// 				const { itemID, name, user, passwd, uri, note, fav, trash } =
				// 					item;
				// 				// Decrypt Data upon arrival
				// 				return {
				// 					id: itemID,
				// 					name: await handleDecrypt(JSON.parse(name)),
				// 					user: await handleDecrypt(JSON.parse(user)),
				// 					passwd: await handleDecrypt(JSON.parse(passwd)),
				// 					uri: JSON.parse(await handleDecrypt(JSON.parse(uri))),
				// 					note: await handleDecrypt(JSON.parse(note)),
				// 					favourite: await handleDecrypt(JSON.parse(fav)),
				// 					trash,
				// 				};
				// 			});
				// 			const updatedList = await Promise.all(updatedListPromises);
				// 			setPasswdList(updatedList);
				// 		}
				// 	} catch (error) {
				// 		console.error(error.response?.data?.msg, error);
				// 		setPageError("Retrieving & Decrypting Data Failed");
				// 	}
				// };
				// await handleFetchData();
				await handleFetchList();
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
		if (validPasswd && validEmail) {
			try {
				const response = await instance.post("/api/v1/auth/login", userLogin, {
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				});

				const access_token = response.data?.access_token;
				const masterSalt = base64ToBuffer(response.data?.master_salt);

				if (response.status === 200) {
					setAuth((prev) => ({ ...prev, accessToken: access_token }));

					const { success, payload, error } = await verifyToken(access_token);

					if (success) {
						setAuth((prev) => ({ ...prev, user: payload }));
						await initialiseCrypto(userLogin.passwd, masterSalt);
						setUserLogin((prev) => ({ ...prev, passwd: "" }));
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
		} else if (!validPasswd) {
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
					ref={passwdRef}
					value={userLogin.passwd}
					error={inputError}
					onChange={(e) =>
						setUserLogin((prev) => ({ ...prev, passwd: e.target.value }))
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
