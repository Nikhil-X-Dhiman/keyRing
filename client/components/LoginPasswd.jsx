/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { passwdSchema } from "../utils/authSchema.js";
import { instance, privateInstance } from "../api/axios.js";
import { useAuth } from "../hooks/useAuth.js";
import { Link, Navigate, useNavigate, useLocation } from "react-router";
import { useVerifyAccessToken } from "../hooks/useVerifyJWT.jsx";

export const LoginPasswd = () => {
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);

	const passwdRef = useRef();

	const [err, setErr] = useState(undefined);
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

	useEffect(() => {
		passwdRef.current?.focus();
	}, []);

	useEffect(() => {
		setMaidenInput(true);
		if (userLogin.passwd) {
			const { success } = passwdSchema.safeParse(userLogin.passwd);
			// success, error & data
			if (success) {
				setValidPasswd(true);
				// setErr("");
			} else {
				setValidPasswd(false);
			}
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
					setErr("Error: Public Key Not Found");
				}
			} catch (error) {
				console.error("Public Key: Unable to send or receive data", error);
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

				const access_token = response.data.access_token;
				if (response.status === 200) {
					setAuth((prev) => ({ ...prev, accessToken: access_token }));
					console.log("Access Token: ", access_token);

					const { isValid, payload, error } = await verifyToken(access_token);

					if (isValid) {
						setAuth((prev) => ({ ...prev, user: payload }));
						setUserLogin((prev) => ({ ...prev, passwd: "" }));
						localStorage.setItem("isLogged", JSON.stringify(true));
						navigate(from, { replace: true });
					} else {
						console.error("Verify Access Token Failed: ", error);
					}
				} else {
					console.error("Client: Request Failed");
				}
			} catch (error) {
				if (!error?.response) {
					console.error("No Server Response", error);
				} else {
					console.error("Server Error: Login Failed!!!: ", error);
				}
			} finally {
				setIsLoading(false);
			}
		} else if (!validEmail) {
			navigate("/login/email", { replace: true });
		} else if (!validPasswd) {
			setErr("Incorrect Password!!!");
			passwdRef.current?.focus();
		}
		setIsLoading(false);
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
		<>
			<main>
				<figure>
					<img src="/wave.png" alt="wave-img" />
					<figcaption>Welcome Back</figcaption>
				</figure>
				{userLogin.email}
				<form>
					<fieldset>
						<legend>
							Password <span>(required)</span>
						</legend>
						<input
							type="password"
							id="login-passwd"
							ref={passwdRef}
							value={userLogin.passwd}
							onChange={(e) =>
								setUserLogin((prev) => ({ ...prev, passwd: e.target.value }))
							}
							required
						/>
					</fieldset>
					{/* TODO: change hide & unhide using CSS */}
					{err && maidenInput ? <p>{err}</p> : <p></p>}
					<button onClick={handleSubmitBtn}>Login</button>
				</form>
				<button onClick={() => navigate("/login/email")}>Go Back</button>
				<div>
					New to Bitwarden?
					<Link to="/register">Create account</Link>
				</div>
			</main>
		</>
	);
};
