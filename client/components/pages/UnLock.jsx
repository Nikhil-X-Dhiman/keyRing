/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { base64ToBuffer, useCrypto } from "../../hooks/useCrypto";
import LockIcon from "../../src/assets/lock.svg?react";
import PasswdVisibleOnIcon from "../../public/visibility.svg?react";
import PasswdVisibleOffIcon from "../../public/visibility-off.svg?react";
import CrossIcon from "../../public/cross.svg?react";
import { usePrivateInstance } from "../../hooks/usePrivateInstance";
// import { replace } from "react-router";
import { passwdSchema } from "../../utils/authSchema";
import { instance } from "../../api/axios";
import { useLocation, useNavigate } from "react-router";
import { InputField } from "../InputField";
export const UnLock = () => {
	const {
		auth,
		setAuth,
		userLogin,
		validEmail,
		validPasswd,
		setUserLogin,
		setValidPasswd,
		setPublicKey,
	} = useAuth();
	const { initialiseCrypto, clearSessionKey } = useCrypto();
	const privateInstance = usePrivateInstance();
	const [showPasswd, setShowPasswd] = useState(false);
	const [err, setErr] = useState(undefined);
	const [maidenInput, setMaidenInput] = useState(false);
	const passwdRef = useRef(null);

	const location = useLocation();
	const navigate = useNavigate();
	const from = location.state?.from?.pathname || "/user/home";

	useEffect(() => {
		passwdRef.current.focus();
	}, []);

	useEffect(() => {
		if (auth.masterKey) {
			console.log("UnLock: Master Key detected, navigating to /user/home");
			navigate("/user/home", { replace: true });
		}
	}, [auth.masterKey]);

	useEffect(() => {
		setMaidenInput(true);
		if (userLogin.passwd) {
			const { success } = passwdSchema.safeParse(userLogin.passwd);
			// success, error & data
			if (success) {
				setValidPasswd(true);
				setErr("");
			} else {
				setValidPasswd(false);
			}
		} else {
			setErr("");
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

	if (!auth.user) {
		console.log("User Not Logged In!!!");

		return <Navigate to="/login/email" replace />;
	}

	const handlePasswdVisibility = (e) => {
		e.preventDefault();
		setShowPasswd((prev) => !prev);
	};

	const handleSubmitBtn = async (e) => {
		e.preventDefault();
		// setIsLoading(true);
		console.log("hello");
		console.log("Valid: ", validPasswd);

		if (validPasswd) {
			try {
				const response = await privateInstance.post(
					"/api/v1/auth/salt",
					userLogin
				);
				console.log("Present 1");

				const masterSalt = await base64ToBuffer(response.data?.master_salt);
				console.log("Present 2");

				if (response.status === 200) {
					await initialiseCrypto(userLogin.passwd, masterSalt);
					console.log("UnLock: initialiseCrypto completed.");
					// navigate(from, { replace: true });
				}
			} catch (error) {
				if (!error?.response) {
					console.error("No Server Response", error);
				} else {
					console.error("Server Error: Unlock Failed!!!: ", error);
					setErr(error?.response?.data?.msg);
				}
			} finally {
				setUserLogin((prev) => ({ ...prev, passwd: "" }));
				// setIsLoading(false);
			}
		} else if (!validEmail) {
			navigate("/login/email", { replace: true });
		} else if (!validPasswd) {
			setErr("Incorrect Password!!!");
			// passwdRef.current?.focus();
		}
		// setIsLoading(false);
	};

	const handleLogout = async () => {
		const response = await privateInstance.get("/api/v1/auth/logout", {
			withCredentials: true,
		});
		const success = response?.data?.success;
		const message = response?.data?.msg;
		console.log("logout response: ", response);

		console.log(success, message);

		if (response.status === 200) {
			console.log("logged out");
			localStorage.setItem("isLogged", JSON.stringify(false));
			navigate(from, { replace: true });
			setAuth(null);
			clearSessionKey();
		}
	};
	return (
		<main className="flex flex-col justify-center items-center pt-15 select-none">
			<figure className="flex flex-col items-center gap-y-2 p-2 select-none text-white">
				<LockIcon className="w-26 h-26 text-light-grey scale-x-[-1]" />
				<figcaption>Your Vault is Locked</figcaption>
			</figure>
			{userLogin.email}
			<form className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md mt-7">
				{/* <fieldset
					className={`w-full px-2 pb-2 rounded-md border-1 ${
						err && maidenInput ? "border-red-500" : "border-gray-400"
					} focus-within:border-blue-500 hover:border-blue-300
					focus-within:hover:border-blue-500 transition-all relative `}
				>
					<legend className="text-[.8rem] text-gray-400">
						Password <span>(required)</span>
					</legend>
					<input
						type={showPasswd ? "text" : "password"}
						id="lock-passwd"
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
				</fieldset> */}
				{/* reusable component start */}
				<InputField
					label="Password"
					id="lock-passwd"
					required="true"
					type="password"
					showToggle="true"
					ref={passwdRef}
					value={userLogin.passwd}
					onChange={(e) =>
						setUserLogin((prev) => ({ ...prev, passwd: e.target.value }))
					}
				/>

				{/* reusable component end */}

				<div className="">
					{err && maidenInput ? (
						<p className="flex items-center gap-1 text-[.7rem] font-semibold text-left text-red-500 mt-1 -mb-1">
							<CrossIcon className="w-3 h-3 font-bold" />
							{err}
						</p>
					) : (
						<p></p>
					)}
				</div>
				<button
					className="bg-blue-400 hover:bg-blue-300 text-slate-800 font-medium py-2 px-4 w-full rounded-3xl cursor-pointer shadow-md transition duration-200 ease-in-out mt-2"
					onClick={handleSubmitBtn}
				>
					Unlock
				</button>
				<p>or</p>
				<button
					className="border-2 border-blue-400 hover:bg-blue-400 text-blue-400 hover:text-slate-800 font-medium py-2 px-4 w-full rounded-3xl cursor-pointer shadow-md transition duration-200 ease-in-out"
					onClick={handleLogout}
				>
					Logout
				</button>
			</form>
		</main>
	);
};
