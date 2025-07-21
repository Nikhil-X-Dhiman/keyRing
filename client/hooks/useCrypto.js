import { useAuth } from "./useAuth";
import {
	CryptoBytesRequirement,
	UnmatchedPayloadParams,
} from "../errors/customError";

const PBKDF2_ITERATIONS = 500000; // Recommended iterations
const PBKDF2_HASH_ALGORITHM = "SHA-256";
const AES_KEY_LENGTH = 256; // bits (128, 192, or 256)
const AES_ALGORITHM_NAME = "AES-GCM";
const IV_LENGTH_BYTES = 12; // 12 bytes (96 bits)
const SALT_LENGTH_BYTES = 16;

export const generateCryptoRandomValue = (numBytes = SALT_LENGTH_BYTES) => {
	if (numBytes === undefined || numBytes === null || numBytes <= 0) {
		throw new CryptoBytesRequirement(
			"Number of bytes for random generation must be a positive number."
		);
	}
	return window.crypto.getRandomValues(new Uint8Array(numBytes));
};

// Convert ArrayBuffer to Base64 String
export const bufferToBase64 = (buffer) => {
	const bytes = new Uint8Array(buffer);
	let binaryString = "";
	bytes.forEach((byte) => {
		binaryString += String.fromCharCode(byte);
	});
	return btoa(binaryString);
};

// Convert Base64 to ArrayBuffer
export const base64ToBuffer = (base64) => {
	const binaryString = atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
};

// Derive the Key From The Password
const deriveKey = async (password, salt) => {
	if (!password || !salt) {
		throw new Error("Password or Salt is not available.");
	}
	const passwdBuffer = new TextEncoder().encode(password);

	const keyMaterial = await window.crypto.subtle.importKey(
		"raw",
		passwdBuffer,
		{ name: "PBKDF2" },
		false,
		["deriveKey"]
	);

	const derivedKey = await window.crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: PBKDF2_ITERATIONS,
			hash: PBKDF2_HASH_ALGORITHM,
		},
		keyMaterial,
		{ name: AES_ALGORITHM_NAME, length: AES_KEY_LENGTH }, // desired AES key length (256 bits)
		false, // key is not extractable
		["encrypt", "decrypt"] // key can be used for both encryption and decryption
	);
	return derivedKey;
};

export const useCrypto = () => {
	// Starts Derive Key by suppling passwd and salt
	const { setUserLogin, auth, setAuth } = useAuth();
	// const masterKeyRef = useRef(null);

	const initialiseCrypto = async (masterPassword, masterSalt) => {
		if (!masterPassword || !masterSalt) {
			throw new Error("Error: Password or Salt Not Provided.");
		}
		try {
			// const sessionSalt = generateCryptoRandomValue(SALT_LENGTH_BYTES);
			const masterKey = await deriveKey(masterPassword, masterSalt);
			// masterKeyRef.current = masterKey;
			setAuth((prev) => ({ ...prev, masterKey }));

			console.log("Master Key Created.");

			return true;
		} catch (error) {
			throw new Error("Failed to create Master Key: " + error);
		} finally {
			setUserLogin((prev) => ({ ...prev, password: "" }));
			console.log("User Login Password is Cleared");
		}
	};

	// Encrypt the data using the master key
	const handleEncrypt = async (plainData) => {
		// console.log("inside encrypt: ", plainData, masterKeyRef.current);
		console.log("inside encrypt: ", plainData, auth.masterKey);

		// if (!masterKeyRef.current) {
		if (!auth.masterKey) {
			console.error("Encryption Error: No Master Key to encrypt.");
			throw new Error("Encryption Failed: Key not found.");
		}
		if (!plainData) {
			console.log("Not Data To Encrypt");

			return null;
		}
		console.log("pre Encryption: ", plainData);

		try {
			// random IV for AES_GCM (12 Bytes)
			const iv = generateCryptoRandomValue(IV_LENGTH_BYTES);
			// convert to buffer
			const dataBytes = new TextEncoder().encode(plainData);
			// encrypt the data here
			// console.log("Pre Encryption Plain Text: ", plainData);

			const encryptedBuffer = await window.crypto.subtle.encrypt(
				{ name: AES_ALGORITHM_NAME, iv },
				// masterKeyRef.current,
				auth.masterKey,
				dataBytes
			);
			// console.log("Post Encryption Encrypted Buffer: ", encryptedBuffer);
			// prepare data for transmission
			const payload = {
				encryptedData: bufferToBase64(encryptedBuffer),
				iv: bufferToBase64(iv),
			};
			console.log("Encrypted Data: ", JSON.stringify(payload));
			return payload;
		} catch (error) {
			console.error("Error: Encryption Failed: ", error);
			throw new Error("Encryption Failed: ", error.message);
		}
	};
	// Decrypt the Data from the server using master key
	const handleDecrypt = async (payload) => {
		if (!payload?.encryptedData) {
			return null;
		}
		if (
			// !masterKeyRef.current ||
			!auth.masterKey ||
			!payload ||
			!payload.encryptedData ||
			!payload.iv
		) {
			throw new Error(
				"Error: Decrypt Failed, Requirements are not met (masterkey & payload)."
			);
		}
		try {
			// convert data into buffer
			const encryptedData = base64ToBuffer(payload.encryptedData);
			const iv = base64ToBuffer(payload.iv);

			// Decrypt Data here
			const decryptedBuffer = await window.crypto.subtle.decrypt(
				{ name: AES_ALGORITHM_NAME, iv },
				// masterKeyRef.current,
				auth.masterKey,
				encryptedData
			);

			// convert buffer to string
			const plainData = new TextDecoder().decode(decryptedBuffer);
			console.log("Decrypted Data: ", plainData);
			return plainData;
		} catch (error) {
			console.error("Decryption Failed!!!");
			if (error instanceof UnmatchedPayloadParams) {
				console.error("Error: ", error.message);
			}
		}
	};

	const clearSessionKey = () => {
		setAuth((prev) => ({ ...prev, masterKey: "" }));
		console.log("Session Key Cleared");
	};

	const handleListToDecrypt = async (itemList) => {
		const updatedListPromises = itemList.map(async (item) => {
			const { uuid, name, username, password, uri, note, favourite, trash } =
				item;

			// Decrypt Data upon arrival
			return {
				uuid,
				name: await handleDecrypt(JSON.parse(name)),
				username: await handleDecrypt(JSON.parse(username)),
				password: await handleDecrypt(JSON.parse(password)),
				uri: JSON.parse(await handleDecrypt(JSON.parse(uri))),
				note: await handleDecrypt(JSON.parse(note)),
				favourite,
				trash,
			};
		});
		const updatedList = await Promise.all(updatedListPromises);
		return updatedList;
	};

	// generateSessionKey: call when signing in
	// clearSessionKey: call when signing out
	return {
		initialiseCrypto,
		handleEncrypt,
		handleDecrypt,
		clearSessionKey,
		handleListToDecrypt,
	};
};
