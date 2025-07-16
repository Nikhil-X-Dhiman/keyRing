/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { base64ToBuffer, useCrypto } from "../../hooks/useCrypto";
import LockIcon from "../../src/assets/lock.svg?react";
import { usePrivateInstance } from "../../hooks/usePrivateInstance";
import { passwdSchema } from "../../utils/authSchema";
import { instance } from "../../api/axios";
import { useLocation, useNavigate } from "react-router";
import { InputField } from "../InputField";
import { Button } from "../Button";
import { ErrorModal } from "../ErrorModal";
import { AuthFormHeader } from "../AuthFormHeader";
export const UnLock = () => {
	const {
		auth,
		setAuth,
		userLogin,
		validPasswd,
		setUserLogin,
		setValidPasswd,
		setPublicKey,
	} = useAuth();
	const { initialiseCrypto, clearSessionKey } = useCrypto();
	const privateInstance = usePrivateInstance();
	const [modalError, setModalError] = useState("");
	const [inputError, setInputError] = useState("");
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
		if (validPasswd === true) {
			setInputError("");
		}
	}, [validPasswd]);

	useEffect(() => {
		if (userLogin.passwd) {
			const { success } = passwdSchema.safeParse(userLogin.passwd);
			// success, error & data
			if (success) {
				setValidPasswd(true);
				setInputError("");
			} else {
				setValidPasswd(false);
				setInputError("Incorrect Password Format.");
			}
		} else {
			setInputError("Password Field is Empty");
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
					setModalError("Error: Public Key Not Found");
				}
			} catch (error) {
				console.error("Public Key: Unable to send or receive data", error);
				setModalError("Public Key Not Available");
			}
		}
		publicKeyRequest();
	}, []);

	if (!auth.user) {
		console.log("User Not Logged In!!!");

		return <Navigate to="/login/email" replace />;
	}

	const handleSubmitBtn = async (e) => {
		e.preventDefault();
		if (!userLogin.passwd) {
			setModalError("Password Field Cannot be Empty.");
		}
		if (validPasswd) {
			try {
				const response = await privateInstance.post(
					"/api/v1/auth/salt",
					userLogin
				);
				console.log("Present 1");

				if (response.status === 200) {
					const masterSalt = await base64ToBuffer(response.data?.master_salt);
					console.log("Present 2");
					await initialiseCrypto(userLogin.passwd, masterSalt);
					console.log("UnLock: initialiseCrypto completed.");
					setUserLogin((prev) => ({ ...prev, passwd: "" }));
				}
			} catch (error) {
				if (!error?.response) {
					console.error("No Server Response", error);
					setModalError("No Server Response.");
				} else if (error?.response?.status === 403) {
					console.error("Error: Failed to Unlock.");

					setModalError("Failed to Unlock.");
				} else {
					console.error("Server Error: Unlock Failed!!!: ", error);
					setModalError(
						"Error: ",
						error?.response?.data?.msg || "Error: Failed to Unlock!!!"
					);
				}
			}
		} else if (userLogin.passwd === "") {
			setModalError("Password Field is Empty.");
		} else {
			setModalError("Incorrect Password.");
		}
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

	const onClose = () => {
		setModalError("");
	};

	return (
		<main className="flex flex-col justify-center items-center pt-15 select-none">
			<ErrorModal isOpen={modalError} message={modalError} onClose={onClose} />

			<AuthFormHeader title="Your Vault is Locked" Icon={LockIcon} />

			{userLogin.email}

			<form className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md mt-7 overflow-y-auto">
				<InputField
					label="Password"
					id="lock-passwd"
					required="true"
					type="password"
					showToggle="true"
					ref={passwdRef}
					value={userLogin.passwd}
					error={inputError}
					onChange={(e) =>
						setUserLogin((prev) => ({ ...prev, passwd: e.target.value }))
					}
				/>

				<Button
					title="Unlock the Vaule"
					variant="primary"
					onClick={handleSubmitBtn}
				>
					Unlock
				</Button>

				<p>or</p>

				<Button
					title="Logs you out of this device"
					variant="outline"
					onClick={handleLogout}
				>
					Logout
				</Button>
			</form>
		</main>
	);
};
