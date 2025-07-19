import { useAuth } from "./useAuth";
import { usePrivateInstance } from "./usePrivateInstance";
import { useCrypto } from "./useCrypto";
import { instance } from "../api/axios";

export const useFetchData = () => {
	const {
		// auth,
		// setAuth,
		// appLoading,
		// setAppLoading,
		setPublicKey,
		setPasswdList,
	} = useAuth();
	const privateInstance = usePrivateInstance();
	const { handleDecrypt } = useCrypto();

	const publicKeyRequest = async () => {
		// Fetch Public Key to Verify Access Token
		try {
			const response = await instance.get("/api/v1/auth/public");
			if (response.status === 200) {
				await setPublicKey(response.data.publicKey);
			} else if (response.status === 204) {
				throw new Error("Public Key Not Found");
			}
		} catch (error) {
			console.error("Public Key: Unable to send or receive data", error);
			throw new Error("Unable to retrieve data");
		}
	};

	const handleFetchList = async () => {
		try {
			const response = await privateInstance.get("/api/v1/all");

			const { success, result } = response.data;
			if (success) {
				const updatedListPromises = result.map(async (item) => {
					const { itemID, name, user, passwd, uri, note, fav, trash } = item;
					// Decrypt Data upon arrival
					return {
						id: itemID,
						name: await handleDecrypt(JSON.parse(name)),
						user: await handleDecrypt(JSON.parse(user)),
						passwd: await handleDecrypt(JSON.parse(passwd)),
						uri: JSON.parse(await handleDecrypt(JSON.parse(uri))),
						note: await handleDecrypt(JSON.parse(note)),
						favourite: await handleDecrypt(JSON.parse(fav)),
						trash,
					};
				});
				const updatedList = await Promise.all(updatedListPromises);
				setPasswdList(updatedList);
			}
		} catch (error) {
			console.error(error.response?.data?.msg, error);
			throw new Error("Retrieving & Decrypting Data Failed");
			// setPageError("Retrieving & Decrypting Data Failed");
		}
	};

	return { publicKeyRequest, handleFetchList };
};
