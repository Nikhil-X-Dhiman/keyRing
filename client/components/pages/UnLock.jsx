import { InputField } from "../InputField";
import { Button } from "../Button";
import { ErrorModal } from "../ErrorModal";
import { AuthFormHeader } from "../AuthFormHeader";
import { ClockLoader } from "react-spinners";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useCrypto } from "../../hooks/useCrypto";
import { useNavigate } from "react-router";
import { passwdSchema } from "../../utils/authSchema";
import LockIcon from "../../src/assets/lock.svg?react";
import { useAccount } from "../../hooks/useAccount";
import { useDB } from "../../hooks/useDB";

const UnLock = () => {
	const { auth, masterKey } = useAuth();
	const { logout } = useAccount();
	const { handleFetchAppStateDB, handleGetProtectedStateDB } = useDB();
	const { initialiseCrypto, handleVerifyHash, handleHashing } = useCrypto();
	const navigate = useNavigate();
	const [passwordValue, setPasswordValue] = useState("");
	const [validPassword, setValidPassword] = useState("");
	const [modalError, setModalError] = useState("");
	const [inputError, setInputError] = useState("");
	const [localLoading, setLocalLoading] = useState(false);
	const passwordRef = useRef(null);

	useEffect(() => {
		passwordRef.current.focus();
	}, []);

	useEffect(() => {
		setLocalLoading(false);
	}, [modalError]);

	useEffect(() => {
		if (validPassword === true) {
			setInputError("");
		}
	}, [validPassword]);

	useEffect(() => {
		if (passwordValue) {
			const { success } = passwdSchema.safeParse(passwordValue);
			// success, error & data
			setValidPassword(success);
			setInputError(success ? "" : "Incorrect Password Format.");
		} else {
			setInputError("Password Field is Empty");
		}
	}, [passwordValue]);

	const handleSubmitBtn = async (e) => {
		setLocalLoading(true);
		e.preventDefault();
		if (!passwordValue) {
			setModalError("Password Field Cannot be Empty.");
			return;
		}
		console.log("pre submit request");

		if (validPassword) {
			try {
				const result = await handleVerifyHash(passwordValue);
				if (!result) {
					setModalError("Incorrect Password.");
					console.error(
						"UnLock > handleSubmit: Error occured while unlocking Vault: "
					);
					return;
				}
				const masterSalt = await handleFetchAppStateDB("master_salt");
				// console.log(masterSalt);
				masterKey.current = await initialiseCrypto(passwordValue, masterSalt);
				console.log("UnLock -> MasterKey Created: ", masterKey.current);
				setLocalLoading(false);
				console.log("UnLock -> Redirecting to Home");

				navigate("/home", { replace: true });
			} catch (error) {
				setModalError("Failed to Unlock");
				console.error("Unlock -> Failed to Unlock: ", error);
			}
		} else if (passwordValue === "") {
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

			{auth.user.email}

			<form className="flex flex-col items-center gap-y-1 border-1 border-gray-400 rounded-2xl m-5 p-7  bg-slate-800 w-md mt-7 overflow-y-auto">
				<InputField
					label="Password"
					id="lock-passwd"
					required={true}
					type="password"
					showToggle={true}
					ref={passwordRef}
					value={passwordValue}
					error={inputError}
					onChange={(e) => setPasswordValue(e.target.value)}
				/>

				<Button
					title="Unlock the Vaule"
					variant="primary"
					onClick={handleSubmitBtn}
					className="flex justify-center items-center gap-2"
				>
					{localLoading && <ClockLoader size={23} />}
					{localLoading ? "Processing..." : "Unlock"}
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

export default UnLock;
