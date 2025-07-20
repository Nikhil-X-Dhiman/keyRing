import { useAuth } from "./useAuth";
import { usePrivateInstance } from "./usePrivateInstance";
import { useCrypto } from "./useCrypto";
import { instance } from "../api/axios";
import { useDB } from "./useDB";

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
	const { handleListToDecrypt } = useCrypto();
	const { handleAddItemDB, fetchAllItemsDB } = useDB();

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
				// Add Items to Local DB, can't use bulk coz of different colums name
				result.forEach(async (item) => {
					try {
						await handleAddItemDB(item);
					} catch (error) {
						console.error(
							"Failed to Add Items into IndexedDB. Maybe it already exist: ",
							error
						);
					}
				});
				const plainTextCloudList = await handleListToDecrypt(result);
				console.log("Plain Text Cloud List: ", plainTextCloudList);

				setPasswdList(plainTextCloudList);
			}
		} catch (error) {
			console.error(error.response?.data?.msg, error);
			throw new Error("Retrieving & Decrypting Data Failed");
		}
	};

	return { publicKeyRequest, handleFetchList };
};
