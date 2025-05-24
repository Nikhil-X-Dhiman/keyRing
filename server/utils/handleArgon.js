import argon2 from "argon2";

export const genPasswdHash = async (passwd) => {
	return await argon2.hash(passwd, {
		type: argon2.argon2id,
		timeCost: 3,
		memoryCost: 10000,
		parallelism: 4,
		hashLength: 32,
	});
};

export const verifyPasswd = async (passwd, hashPasswd) => {
	try {
		return await argon2.verify(hashPasswd, passwd);
	} catch (error) {
		console.error(error);
		return false;
	}
};
