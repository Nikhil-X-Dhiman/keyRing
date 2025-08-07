import { useAuth } from "./useAuth";
import {
	CryptoBytesRequirement,
	UnmatchedPayloadParams,
} from "../errors/customError";
import { useDB } from "./useDB";

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

// Convert Buffer to Hex
export function bufferToHex(buffer) {
	const bytes = new Uint8Array(buffer);
	return Array.from(bytes)
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}

// Convert Hex to Buffer
export function hexToBuffer(hex) {
	if (hex.length % 2 !== 0) {
		throw new Error("Invalid hex string");
	}
	const byteArray = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		byteArray[i / 2] = parseInt(hex.slice(i, i + 2), 16);
	}
	return byteArray.buffer; // Returns ArrayBuffer
}

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
	const { masterKey } = useAuth();
	const { handleGetProtectedStateDB } = useDB();
	// const masterKeyRef = useRef(null);

	const initialiseCrypto = async (masterPassword, masterSalt) => {
		console.log("Crypto values: ", masterPassword, masterSalt);
		if (!masterPassword || !masterSalt) {
			throw new Error("Error: Password or Salt Not Provided.");
		}

		try {
			// const sessionSalt = generateCryptoRandomValue(SALT_LENGTH_BYTES);
			const masterKey = await deriveKey(
				masterPassword,
				base64ToBuffer(masterSalt)
			);
			// masterKeyRef.current = masterKey;
			// setAuth((prev) => ({ ...prev, masterKey }));

			console.log("Master Key Created.");

			return masterKey;
		} catch (error) {
			throw new Error("Failed to create Master Key: " + error);
		} finally {
			console.log("User Login Password is Cleared");
		}
	};

	// Encrypt the data using the master key
	const handleEncrypt = async (plainData) => {
		// console.log("inside encrypt: ", plainData, masterKeyRef.current);
		console.log("inside encrypt: ", plainData, masterKey.current);

		// if (!masterKeyRef.current) {
		if (!masterKey.current) {
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
				masterKey.current,
				dataBytes
			);
			// console.log("Post Encryption Encrypted Buffer: ", encryptedBuffer);
			// prepare data for transmission
			const payload = {
				encryptedData: bufferToBase64(encryptedBuffer),
				iv: bufferToBase64(iv),
			};
			console.log("Encrypted Data: ", JSON.stringify(payload));
			return JSON.stringify(payload);
		} catch (error) {
			console.error("Error: Encryption Failed: ", error);
			throw new Error("Encryption Failed: ", error.message);
		}
	};
	// Decrypt the Data from the server using master key
	const handleDecrypt = async (payload) => {
		payload = JSON.parse(payload) || null;
		if (!payload?.encryptedData) {
			return null;
		}
		if (
			// !masterKeyRef.current ||
			!masterKey.current ||
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
				masterKey.current,
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
		// setAuth((prev) => ({ ...prev, masterKey: "" }));
		masterKey.current = "";
		console.log("Session Key Cleared");
	};

	const handleListToDecrypt = async (itemList) => {
		console.log("useCrypto->Decryption itemlist: ", itemList);
		const updatedListPromises = itemList.map(async (item) => {
			console.log("useCrypto->Decryption item: ", itemList);

			const { uuid, name, username, password, uri, note, favourite, trash } =
				item;
			// Decrypt Data upon arrival
			return {
				uuid,
				name: await handleDecrypt(name),
				username: await handleDecrypt(username),
				password: await handleDecrypt(password),
				uri: JSON.parse(await handleDecrypt(uri)),
				note: await handleDecrypt(note),
				favourite,
				trash,
			};
		});
		const updatedList = await Promise.all(updatedListPromises);
		return updatedList;
	};

	const handleHashing = async (masterPassword, passwordSalt) => {
		try {
			const encodedPassword = new TextEncoder().encode(
				masterPassword + passwordSalt
			);

			const hashPasswordBuffer = await crypto.subtle.digest(
				"SHA-256",
				encodedPassword
			);

			console.log(
				"useCrypto > handleHashing: Hash Buffer of Password: ",
				hashPasswordBuffer
			);

			const hexPassword = bufferToHex(hashPasswordBuffer);

			console.log(
				"useCrypto > handleHashing: Hex Hash Buffer of Password: ",
				hashPasswordBuffer
			);

			return hexPassword;
		} catch (error) {
			console.error(
				"useCrypto > handleHashing: Error Occured Hashing the Password: ",
				error
			);
			return false;
		}
	};

	const handleVerifyHash = async (currentMasterPassword) => {
		try {
			const { passwd_hash: passwordHash, hash_salt: hashSalt } =
				await handleGetProtectedStateDB();
			console.log(
				"useCrypto > verifyHash: Password Hash & Salt Hash Got from LocalDB: ",
				passwordHash,
				hashSalt
			);
			const currentPasswordHash = await handleHashing(
				currentMasterPassword,
				hashSalt
			);
			if (currentPasswordHash === passwordHash) {
				console.log(
					"useCrypto > verifyHash: Master Password Verified & is valid"
				);
				return true;
			} else {
				console.error("useCrypto > verifyHash: Master Password is Not Correct");
				return false;
			}
		} catch (error) {
			console.error(
				"useCrypto > verifyHashError: Error Occured while verifying the Password using LocalDB: ",
				error
			);
			return false;
		}
	};

	// generateSessionKey: call when signing in
	// clearSessionKey: call when signing out
	return {
		initialiseCrypto,
		handleEncrypt,
		handleDecrypt,
		clearSessionKey,
		handleListToDecrypt,
		handleHashing,
		handleVerifyHash,
	};
};
