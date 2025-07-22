/* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useRef, useState } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { base64ToBuffer, useCrypto } from "../../hooks/useCrypto";
// import { usePrivateInstance } from "../../hooks/usePrivateInstance";
// import { passwdSchema } from "../../utils/authSchema";
// // import { instance } from "../../api/axios";
// import { useLocation, useNavigate } from "react-router";
import { InputField } from "../InputField";
import { Button } from "../Button";
import { ErrorModal } from "../ErrorModal";
import { AuthFormHeader } from "../AuthFormHeader";
// import { useFetchData } from "../../hooks/useFetchData";
import { ClockLoader } from "react-spinners";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { base64ToBuffer, useCrypto } from "../../hooks/useCrypto";
import { useFetchData } from "../../hooks/useFetchData";
import { usePrivateInstance } from "../../hooks/usePrivateInstance";
import { useNavigate } from "react-router";
import { passwdSchema } from "../../utils/authSchema";
import LockIcon from "../../src/assets/lock.svg?react";
import { useAccount } from "../../hooks/useAccount";

// import { useDB } from "../../hooks/useDB";
export const UnLock = () => {
	const { auth, userLogin, validPasswd, setUserLogin, setValidPasswd } =
		useAuth();
	const { logout } = useAccount();
	const { initialiseCrypto } = useCrypto();
	const privateInstance = usePrivateInstance();
	const { publicKeyRequest, handleFetchList } = useFetchData();

	const [modalError, setModalError] = useState("");
	const [inputError, setInputError] = useState("");
	const [loading, setLoading] = useState(false);
	const passwordRef = useRef(null);

	// const location = useLocation();
	const navigate = useNavigate();
	// const from = location.state?.from?.pathname || "/user/home";

	useEffect(() => {
		passwordRef.current.focus();
	}, []);

	useEffect(() => {
		setLoading(false);
	}, [modalError]);

	useEffect(() => {
		if (auth.masterKey && loading === false) {
			console.log("UnLock: Loading complete redirecting to Home");
			// navigate("/user/home", { replace: true });
			navigate("/user/home", { replace: true });
		}
	}, [loading]);

	useEffect(() => {
		async function fetch() {
			if (auth.masterKey && loading === true) {
				console.log("Unlock: Master Key Detected...Fetching List from cloud");
				await handleFetchList();

				setLoading(false);
			}
		}
		fetch();
	}, [auth.masterKey]);
	// }, [auth.masterKey]);

	useEffect(() => {
		if (validPasswd === true) {
			setInputError("");
		}
	}, [validPasswd]);

	useEffect(() => {
		if (userLogin.password) {
			const { success } = passwdSchema.safeParse(userLogin.password);
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
	}, [userLogin.password]);

	if (!auth.user) {
		console.error("User Not Logged In!!! Redirect to Email Page");

		return <Navigate to="/login/email" replace />;
	}

	const handleSubmitBtn = async (e) => {
		setLoading(true);
		e.preventDefault();
		if (!userLogin.password) {
			setModalError("Password Field Cannot be Empty.");
		}
		console.log("pre submit request");

		if (validPasswd) {
			try {
				const response = await privateInstance.post(
					"/api/v1/auth/salt",
					userLogin
				);
				console.log("Unlock: Salt Requested");

				if (response.status === 200) {
					console.log("post post submit request");
					const masterSalt = await base64ToBuffer(response.data?.master_salt);
					console.log("post x3 submit request");
					console.log("UnLock salt: ", masterSalt);
					console.log("post x4 submit request");
					await publicKeyRequest();
					await initialiseCrypto(userLogin.password, masterSalt);
					// await handleFetchList();
					console.log(
						"UnLock: initialiseCrypto completed (Master Key is created)."
					);
					setUserLogin((prev) => ({ ...prev, password: "" }));
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
		} else if (userLogin.password === "") {
			setModalError("Password Field is Empty.");
		} else {
			setModalError("Incorrect Password.");
		}
	};

	const handleLogout = async () => {
		await logout();
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
					required={true}
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
					title="Unlock the Vaule"
					variant="primary"
					onClick={handleSubmitBtn}
					className="flex justify-center items-center gap-2"
				>
					{loading && <ClockLoader size={23} />}
					{loading ? "Processing..." : "Unlock"}
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
