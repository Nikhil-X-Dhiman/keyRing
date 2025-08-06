import { useEffect, useState } from "react";
import Modal from "./Modal";
import { ItemField } from "./ItemField";
import { InputField } from "./InputField";
import { CheckboxField } from "./CheckboxField";

const Generator = ({ title, isOpen, onClose, setGeneratePassword }) => {
	const [passwordLength, setPasswordLength] = useState(14);
	const [capitalLetters, setCapitalLetters] = useState(true);
	const [smallLetters, setSmallLetters] = useState(true);
	const [numericalLetters, setNumericalLetters] = useState(true);
	const [specialLetters, setSpecialLetters] = useState(false);
	const [minNumericalLetters, setMinNumericalLetters] = useState(3);
	const [minSpecialLetters, setMinSpecialLetters] = useState(0);
	const [password, setPassword] = useState("");
	const [refreshModal, setRefreshModal] = useState(false);
	// const generatedPasswordRef = useRef("");

	const randomNumberGenerate = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	// Fisher Yates Shuffle Algorithm
	const randomShuffle = (array) => {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex > 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[array[randomIndex]]] = [
				array[randomIndex],
				array[currentIndex],
			];
		}

		return array;
	};

	const handlePasswordCopy = async () => {
		try {
			await navigator.clipboard.writeText(password);
		} catch (error) {
			console.error("Generator > Error Copying Password: ", error);
		}
	};

	const handleSavePassword = () => {
		setGeneratePassword(password);
	};

	const handleSetPasswordLength = (e) => {
		const value = e.target.value;
		if (value >= 5 && value <= 100) {
			setPasswordLength(value);
		}
	};

	const handleSetCapitalLetters = () => {
		setCapitalLetters((prev) => !prev);
	};
	const handleSetSmallLetters = () => {
		setSmallLetters((prev) => !prev);
	};
	const handleSetNumericalLetters = () => {
		setNumericalLetters((prev) => !prev);
	};
	const handleSetSpecialLetters = () => {
		setSpecialLetters((prev) => !prev);
	};
	const handleSetMinNumericalLetters = (e) => {
		const value = e.target.value;
		if (value >= 0) {
			setMinNumericalLetters(e.target.value);
		}
	};
	const handleSetMinSpecialLetters = (e) => {
		const value = e.target.value;
		if (value >= 0) {
			setMinSpecialLetters(e.target.value);
		}
	};
	const handleReRunGeneratePassword = () => {
		setRefreshModal((prev) => !prev);
	};

	useEffect(() => {
		if (minNumericalLetters < 1) {
			setNumericalLetters(false);
		} else {
			setNumericalLetters(true);
		}
	}, [minNumericalLetters]);

	useEffect(() => {
		if (minSpecialLetters < 1) {
			setSpecialLetters(false);
		} else {
			setSpecialLetters(true);
		}
	}, [minSpecialLetters]);

	useEffect(() => {
		if (
			Number(passwordLength) <
			Number(minNumericalLetters) + Number(minSpecialLetters) + 2
		) {
			setPasswordLength(
				Number(minNumericalLetters) + Number(minSpecialLetters) + 2
			);
		}
	}, [passwordLength, minNumericalLetters, minSpecialLetters]);

	useEffect(() => {
		if (
			!capitalLetters &&
			!smallLetters &&
			!numericalLetters &&
			!specialLetters
		) {
			console.error("No Option Selected");

			setPassword("No Option Selected!!! Password can't be Generated");
			return;
		}
		// a-z = 97-122
		// A-Z = 65-90
		// 0-9 = 48-57
		const specialCharacters = "!@#$%^&*()_+[]{}<>?,./";
		const numberCharacters = "0123456789";
		let smallLetterCharacters = "";
		let capitalLetterCharacters = "";
		let newPassword = "";

		for (let i = 97; i <= 122; i++) {
			smallLetterCharacters += String.fromCharCode(i);
		}
		for (let i = 65; i <= 90; i++) {
			capitalLetterCharacters += String.fromCharCode(i);
		}
		// Generate Available Character Letter Pool
		let availableCharacterPool = "";
		if (capitalLetters) {
			availableCharacterPool += capitalLetterCharacters;
		}
		if (smallLetters) {
			availableCharacterPool += smallLetterCharacters;
		}
		if (numericalLetters && minNumericalLetters > 0) {
			availableCharacterPool += numberCharacters;
		}
		if (specialLetters && minSpecialLetters > 0) {
			availableCharacterPool += specialCharacters;
		}
		console.log(
			"Generator > Available Character Pool: ",
			availableCharacterPool
		);
		// Assign atleast 1 or min number of respective character pool
		// 1 capital letter
		if (capitalLetters) {
			newPassword +=
				capitalLetterCharacters[
					randomNumberGenerate(0, capitalLetterCharacters.length - 1)
				];
		}
		// 1 small letter
		if (smallLetters) {
			newPassword +=
				smallLetterCharacters[
					randomNumberGenerate(0, smallLetterCharacters.length - 1)
				];
		}
		// min numerical letters
		if (numericalLetters) {
			for (let i = 0; i < minNumericalLetters; i++) {
				newPassword +=
					numberCharacters[
						randomNumberGenerate(0, numberCharacters.length - 1)
					];
			}
		}
		if (specialLetters) {
			for (let i = 0; i < minSpecialLetters; i++) {
				newPassword +=
					specialCharacters[
						randomNumberGenerate(0, specialCharacters.length - 1)
					];
			}
		}
		console.log("Generator > Min Character Password: ", newPassword);

		// now randomly generate rest of password using available character pool
		for (let i = newPassword.length; i < passwordLength; i++) {
			newPassword +=
				availableCharacterPool[
					randomNumberGenerate(0, availableCharacterPool.length - 1)
				];
		}
		console.log("Generator > Before Shuffle Password: ", newPassword);
		// Shuffle Password to not make password predictable
		let newPasswordArray = newPassword.split("");
		newPasswordArray = randomShuffle(newPasswordArray);
		newPassword = newPasswordArray.join("");
		console.log("Generator > Generated Password: ", newPassword);
		setPassword(newPassword);
	}, [
		capitalLetters,
		smallLetters,
		numericalLetters,
		specialLetters,
		passwordLength,
		minNumericalLetters,
		minSpecialLetters,
		refreshModal,
	]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			button1Behaviour={handleSavePassword}
			button2Behaviour={onClose}
			title={title}
			button1="Use This Password"
			button2="Close"
		>
			<div className="flex flex-col gap-4">
				<div className="flex items-center bg-slate-800 px-2 py-2 rounded-md">
					<ItemField
						name="password"
						showCopy={true}
						showGeneratePasswordLink={true}
						showRefreshGeneratePassword={true}
						handleReRunGeneratePassword={handleReRunGeneratePassword}
						readOnly={true}
						value={password}
						onClick={handlePasswordCopy}
					/>
				</div>
				<div>
					<p className="text-white">Options</p>
					<div className="bg-slate-800 px-2.5 py-2.5 rounded-lg">
						<InputField
							type="number"
							label="Length"
							value={passwordLength}
							onChange={handleSetPasswordLength}
							required={true}
						/>
						<p className="text-[.7rem] mt-[-10px] text-slate-400">
							Value must be between 5 and 128. Use 14 characters or more to
							generate a strong password
						</p>
					</div>
				</div>

				<div className="bg-slate-800 px-2.5 py-2.5 rounded-lg flex flex-col gap-2">
					<p>Include</p>
					<div className="flex justify-between">
						<CheckboxField
							label="A-Z"
							checked={capitalLetters}
							onChange={handleSetCapitalLetters}
							id="capital-letter-checkbox"
						/>
						<CheckboxField
							label="a-z"
							checked={smallLetters}
							onChange={handleSetSmallLetters}
							id="small-letter-checkbox"
						/>
						<CheckboxField
							label="0-9"
							checked={numericalLetters}
							onChange={handleSetNumericalLetters}
							id="numberical-letter-checkbox"
						/>
						<CheckboxField
							label="!@#$%^&*"
							checked={specialLetters}
							onChange={handleSetSpecialLetters}
							id={"special-letter-checkbox"}
						/>
					</div>

					<div className="flex gap-2 pt-1">
						<InputField
							type="number"
							label="Minimum Numbers"
							id="min-number-letters"
							value={minNumericalLetters}
							onChange={handleSetMinNumericalLetters}
						/>
						<InputField
							type="number"
							label="Minimum Special"
							id="min-special-letters"
							value={minSpecialLetters}
							onChange={handleSetMinSpecialLetters}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default Generator;
