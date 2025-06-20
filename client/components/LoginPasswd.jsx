import { useEffect, useRef, useState } from "react";
import { passwdSchema } from "../utils/authSchema.js";
import { instance } from "../api/axios.js";
import { useAuth } from "../hooks/useAuth.js";
import { Link, Navigate, useNavigate, useLocation } from "react-router";
import { useVerifyAccessToken } from "../hooks/useVerifyJWT.jsx";

export const LoginPasswd = () => {
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);

	const [passwdFocus, setPasswdFocus] = useState(false);
	const passwdRef = useRef();

	const [err, setErr] = useState(undefined);
	const location = useLocation();
	const verifyToken = useVerifyAccessToken();
	const from = location.state?.from?.pathname || "/user/home";

	const {
		// auth,
		setAuth,
		userLogin,
		validEmail,
		validPasswd,
		setUserLogin,
		setValidPasswd,
		setPublicKey,
	} = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		passwdRef.current?.focus();
	}, []);

	useEffect(() => {
		if (!passwdFocus && userLogin.passwd) {
			const { success, data, error } = passwdSchema.safeParse(userLogin.passwd);
			if (success) {
				console.log("Passwd Schema Success: ", data);
				setValidPasswd(true);
				setErr("");
			} else {
				setValidPasswd(false);
				console.log(error);

				setErr(error.issues[0].message);
				console.error("Passwd Schema Error: ", err);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [passwdFocus]);

	useEffect(() => {
		setErr("");
	}, [userLogin.passwd]);

	// get public key

	useEffect(() => {
		async function publicKeyRequest() {
			try {
				console.log("Public Key Requested");

				const response = await instance.get("/api/v1/auth/public");
				if (response.status === 200) {
					// TODO: Create Global State for Public Key
					setPublicKey(response.data.publicKey);
					console.log("Public Key: ", response.data.publicKey);
				} else if (response.status === 204) {
					console.log("Public Key: Not Found!!!");
				}
			} catch (error) {
				console.error("Public Key: Unable to send or receive data", error);
			}
		}
		publicKeyRequest();
	}, []);

	if (!userLogin.email && !validEmail) {
		return <Navigate to="/login/email" replace />;
	}

	const handleSubmitBtn = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (validPasswd && validEmail) {
			try {
				const response = await instance.post("/api/v1/auth/login", userLogin, {
					withCredentials: true,
				});

				const access_token = response.data.access_token;
				if (response.status === 200) {
					setAuth((prev) => ({ ...prev, accessToken: access_token }));

					const { isValid, payload, error } = await verifyToken();

					if (isValid) {
						setAuth((prev) => ({ ...prev, user: payload }));
						console.log("Access Token is Verified");
					} else {
						console.error("Verify Access Token Failed: ", error);
					}
					console.log("User Login Success");
					navigate(from, { replace: true });
				} else {
					console.error("Client: Request Failed");
				}
			} catch (error) {
				if (!error?.response) {
					console.error("No Server Response", error);
				} else {
					console.error("Server Error: Login Failed!!!: ", error);
				}
			}
		} else if (!validEmail) {
			navigate("/login/email", { replace: true });
		} else if (!validPasswd) {
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
							onFocus={() => setPasswdFocus(true)}
							onBlur={() => setPasswdFocus(false)}
						/>
					</fieldset>
					{/* TODO: change hide & unhide using CSS */}
					{err && userLogin.passwd ? <p>{err}</p> : <p></p>}
					<button onClick={handleSubmitBtn}>Continue</button>
				</form>
				<button onClick={() => navigate(-1)}>Go Back</button>
				<div>
					New to Bitwarden?
					<Link to="/register">Create account</Link>
				</div>
			</main>
		</>
	);
};
