import { generateKeyPairSync } from "crypto";
import { writeFileSync } from "fs";
try {
	const { publicKey, privateKey } = generateKeyPairSync("rsa", {
		modulusLength: 2048,
		publicKeyEncoding: {
			type: "spki",
			format: "pem",
		},
		privateKeyEncoding: {
			type: "pkcs8",
			format: "pem",
		},
	});

	writeFileSync("../publicKey.pem", publicKey, {
		encoding: "utf-8",
		mode: 0o644,
	}); // Read/write for owner, read-only for others

	writeFileSync("../privateKey.pem", privateKey, {
		encoding: "utf-8",
		mode: 0o600,
	}); // Read/write for owner only
} catch (error) {
	console.error("Pair Key Generation Error: ", error);
}
