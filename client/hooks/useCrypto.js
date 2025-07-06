import { useRef } from "react";
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

export const generateCryptoRandomValue = (numBytes) => {
	if (numBytes === undefined || numBytes === null || numBytes <= 0) {
		throw new CryptoBytesRequirement(
			"Number of bytes for random generation must be a positive number."
		);
	}
	return window.crypto.getRandomValues(new Uint8Array(numBytes));
};

// Convert ArrayBuffer to Base64 String
const bufferToBase64 = (buffer) => {
	const bytes = new Uint8Array(buffer);
	let binaryString = "";
	bytes.forEach((byte) => {
		binaryString += String.fromCharCode(byte);
	});
	return btoa(binaryString);
};

// Convert Base64 to ArrayBuffer
const base64ToBuffer = (base64) => {
	const binaryString = atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
};

// Derive the Key From The Password
const deriveKey = async (passwd, salt) => {
	if (!passwd || !salt) {
		throw new Error("Password or Salt is not available.");
	}
	const passwdBuffer = new TextEncoder().encode(passwd);

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
	const { userLogin, setUserLogin } = useAuth();
	const masterKeyRef = useRef(null);
	// Encrypt the data using the master key

	const generateCryptoKey = async (masterPasswd, masterSalt) => {
		if (!masterPasswd || !masterSalt) {
			throw new Error("Error: Password or Salt Not Provided.");
		}
		try {
			// const sessionSalt = generateCryptoRandomValue(SALT_LENGTH_BYTES);
			const masterKey = await deriveKey(masterPasswd, masterSalt);
			masterKeyRef.current = masterKey;
			console.log("Master Key Created.");

			return true;
		} catch (error) {
			throw new Error("Failed to create Master Key: ", error);
		} finally {
			if (userLogin?.passwd) {
				setUserLogin((prev) => ({ ...prev, passwd: "" }));
				console.log("Password is Cleared");
			}
		}
	};

	const handleEncrypt = async (plainData) => {
		if (!masterKeyRef.current || !plainData) {
			console.error("Encryption Error: No Master Key or Data to encrypt.");
			throw new Error("Encryption Failed: Data or Key not found.");
		}
		try {
			// random IV for AES_GCM (12 Bytes)
			const iv = generateCryptoRandomValue(IV_LENGTH_BYTES);
			// convert to buffer
			const dataBytes = new TextEncoder().encode(plainData);
			// encrypt the data here
			const encryptedBuffer = await window.crypto.subtle.encrypt(
				{ name: AES_ALGORITHM_NAME, iv },
				masterKeyRef.current,
				dataBytes
			);
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
		if (
			!masterKeyRef.current ||
			!payload ||
			payload.encryptedData ||
			!payload.iv
		) {
			throw new Error("Error: Decrypt Failed, Requirements are not met.");
		}
		try {
			// convert data into buffer
			const encryptedData = base64ToBuffer(payload.encryptedData);
			const iv = base64ToBuffer(payload.iv);

			// Decrypt Data here
			const decryptedBuffer = await window.crypto.subtle.decrypt(
				{ name: AES_ALGORITHM_NAME, iv },
				masterKeyRef.current,
				encryptedData
			);

			// convert buffer to string
			const plainData = new TextDecoder().decode(decryptedBuffer);
			console.log("Decrypted Data: ", plainData);
		} catch (error) {
			console.error("Decryption Failed!!!");
			if (error instanceof UnmatchedPayloadParams) {
				console.error("Error: ", error.message);
			}
		}
	};

	const clearSessionKey = () => {
		masterKeyRef.current = null;
		console.log("Session Key Cleared");
	};

	// generateSessionKey: call when signing in
	// clearSessionKey: call when signing out
	return { generateCryptoKey, handleEncrypt, handleDecrypt, clearSessionKey };
};
