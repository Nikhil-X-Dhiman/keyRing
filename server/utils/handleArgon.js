import argon2 from "argon2";

export const genPasswdHash = async (passwd) => {
	try {
		return await argon2.hash(passwd, {
			type: argon2.argon2id,
			timeCost: 3,
			memoryCost: 10000,
			parallelism: 4,
			hashLength: 32,
		});
	} catch (error) {
		console.error("Gen Passwd Hash Error: ", error);
		return null;
	}
};

export const verifyPasswd = async (passwd, hashPasswd) => {
	try {
		return await argon2.verify(hashPasswd, passwd);
	} catch (error) {
		console.error("Verify Passwd: ", error);
		return false;
	}
};
