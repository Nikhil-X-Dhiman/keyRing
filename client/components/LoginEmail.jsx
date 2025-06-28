/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { emailSchema } from "../utils/authSchema.js";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import CrossIcon from "../public/cross.svg?react";

export const LoginEmail = () => {
	const EMAIL_REGEX =
		/^[a-zA-Z][\w]+([._$%&]?[\w]+)*@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/;
	const PASSWD_REGEX =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/;

	const [isLoading, setIsLoading] = useState(false);
	const location = useLocation();
	const from = location.state?.from || "/user/home";
	const navigate = useNavigate();

	const [emailFocus, setEmailFocus] = useState(false);
	const emailRef = useRef();
	const errRef = useRef();

	const [err, setErr] = useState("");

	const {
		// auth,
		userLogin,
		validEmail,
		setUserLogin,
		setValidEmail,
		persist,
		setPersist,
	} = useAuth();

	useEffect(() => {
		emailRef.current?.focus();
		setValidEmail(false);
		setUserLogin({
			email: localStorage.getItem("userEmail") || "",
			passwd: "",
		});
	}, []);

	useEffect(() => {
		errRef.current?.focus();
	}, [err]);

	useEffect(() => {
		if (userLogin.email) {
			const { success, error } = emailSchema.safeParse(userLogin.email);
			if (success) {
				setValidEmail(true);
				setErr("");
			} else {
				setValidEmail(false);
				console.log(error);

				setErr(
					'Email must contain username, "@" & domain name. Characters Allowed are [a-z], [0-9] & [ ._$%& ]'
				);
			}
		}
	}, [emailFocus, userLogin.email]);

	// useEffect(() => {
	// 	if (validEmail === true) {
	// 		setErr("");
	// 	}
	// }, [validEmail]);

	useEffect(() => {
		if (!persist) {
			localStorage.removeItem("userEmail");
		}
	}, [persist]);

	const handleEmailSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);

		if (persist) {
			localStorage.setItem("userEmail", userLogin.email);
		}

		if (validEmail) {
			setIsLoading(false);
			navigate("/login/password", { state: { from: from }, replace: true });
		}
	};

	const togglePersist = () => {
		localStorage.setItem("persist", JSON.stringify(!persist));
		setPersist((prev) => !prev);
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
		<>
			<main className="flex flex-col justify-center items-center pt-15 select-none">
				<figure className="flex flex-col items-center gap-y-2 p-2 select-none">
					<img src="/vault.png" alt="vault-img" className="w-26 h-23" />
					<figcaption className="text-xl font-semibold mb-2">
						Log in to KeyRing
					</figcaption>
				</figure>
				<form
					onSubmit={handleEmailSubmit}
					className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md"
				>
					<fieldset
						className={`w-full px-2 pb-2 rounded-md border-1 ${
							err && userLogin.email ? "border-red-500" : "border-gray-400"
						} focus-within:border-blue-500 hover:border-blue-300
					focus-within:hover:border-blue-500 transition-all`}
					>
						<legend className="text-[.8rem] text-gray-400">
							Email address <span>(required)</span>
						</legend>
						<input
							type="email"
							id="login-email"
							ref={emailRef}
							value={userLogin.email}
							onChange={(e) =>
								setUserLogin((prev) => ({ ...prev, email: e.target.value }))
							}
							required
							onFocus={() => setEmailFocus(true)}
							onBlur={() => setEmailFocus(false)}
							className="w-full border-0 focus:outline-0 autofill:bg-gray-800"
						/>
					</fieldset>
					{/* change hide & unhide using CSS */}
					<div ref={errRef}>
						{err && userLogin.email ? (
							<div className="flex items-center gap-1 mb-1.5">
								<CrossIcon className="w-3.5 h-3.5 font-bold relative bottom-1 text-red-500" />
								<p className="flex items-center gap-1 text-[.7rem] font-semibold text-left text-red-500 mt-1 -mb-1">
									{err}
								</p>
							</div>
						) : (
							<p></p>
						)}
					</div>
					<div className="flex gap-1.5 items-center self-start mb-4">
						<input
							type="checkbox"
							id="login-remember"
							onChange={togglePersist}
							checked={persist}
							className="w-4 h-4 accent-blue-400 hover:accent-blue-300 hover:cursor-pointer transition-all"
						/>
						<label
							htmlFor="login-remember"
							className="cursor-pointer select-none"
						>
							Remember Me
						</label>
					</div>

					<button
						className="bg-blue-400 hover:bg-blue-300 text-slate-800 font-medium py-2 px-4 w-full rounded-3xl shadow-md cursor-pointer transition duration-200 ease-in-out"
						disabled={!validEmail}
					>
						Continue
					</button>
				</form>
				<div>
					New to keyRing?{" "}
					<Link
						to="/register"
						className="text-blue-300 hover:text-blue-200 hover:underline transition duration-200 ease-in-out"
					>
						Create Account
					</Link>
				</div>
			</main>
		</>
	);
};
