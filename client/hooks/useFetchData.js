import { useAuth } from "./useAuth";
import { usePrivateInstance } from "./usePrivateInstance";
import { useCrypto } from "./useCrypto";
import { instance } from "../api/axios";
import { useDB } from "./useDB";
import equal from "fast-deep-equal";

export const useFetchData = () => {
	const {
		// auth,
		// setAuth,
		// appLoading,
		// setAppLoading,
		// setPublicKey,
		// setPasswdList,
		setDerivedAuth,
	} = useAuth();
	const privateInstance = usePrivateInstance();
	const { handleListToDecrypt } = useCrypto();
	const { handleAddItemDB, fetchAllItemsDB } = useDB();

	const publicKeyRequest = async () => {
		// On demand Fetch Public Key to Verify Access Token
		try {
			const response = await instance.get("/api/v1/auth/public");
			if (response.status === 200) {
				setDerivedAuth((prev) => ({
					...prev,
					publicKey: response.data.publicKey,
				}));
				// await setPublicKey(response.data.publicKey);
			} else if (response.status === 204) {
				throw new Error("Public Key Not Found");
			}
		} catch (error) {
			console.error("Public Key: Unable to send or receive data", error);
			throw new Error("Unable to retrieve data");
		}
	};

	const handleFetchLocalDbList = async () => {
		const localDBItemsList = await fetchAllItemsDB();
		const plainTextLocalDBList = await handleListToDecrypt(localDBItemsList);
		return plainTextLocalDBList;
		// setPasswdList(plainTextLocalDBList);
	};

	const handleFetchList = async () => {
		try {
			const response = await privateInstance.get("/api/v1/all");
			const localItemList = await fetchAllItemsDB();

			const stripItem = ({
				uuid,
				name,
				username,
				password,
				uri,
				note,
				favourite,
				trash,
				createdAt,
				updatedAt,
			}) => ({
				uuid,
				name,
				username,
				password,
				uri,
				note,
				favourite,
				trash,
				createdAt,
				updatedAt,
			});
			// Add Items to Local DB, can't use bulk coz of different columns name and maybe deep copy will also not work here

			const localStripped = localItemList.map(stripItem);

			let { success, result } = response.data;
			console.table("useFetchData: Cloud List: ", result);
			console.table("useFetchData: Local List: ", localItemList);

			if (success) {
				// making both size equal in column

				const cloudStripped = result.map(stripItem);

				console.table(cloudStripped, localStripped);

				if (!equal(cloudStripped, localStripped)) {
					const localUUIDs = new Set(localItemList.map((item) => item.uuid));
					for (const item of result) {
						if (!localUUIDs.has(item.uuid)) {
							try {
								const {
									uuid,
									name,
									username,
									password,
									uri,
									note,
									favourite,
									trash,
									createdAt,
									updatedAt,
								} = item;
								await handleAddItemDB({
									uuid,
									name,
									username,
									password,
									uri,
									note,
									favourite,
									trash,
									created_at: new Date(createdAt).toISOString(), // ensure date is iso string formatted from cloud
									updated_at: new Date(updatedAt).toISOString(),
								});
							} catch (error) {
								console.error("Failed to Add Items into IndexedDB: ", error);
							}
						}
					}
				}
				console.log("useFetchData: handle pre decrypt: ", cloudStripped);

				const plainTextCloudList = await handleListToDecrypt(cloudStripped);
				console.log("Plain Text Cloud List: ", plainTextCloudList);
				return plainTextCloudList;
				// setPasswdList(plainTextCloudList);
			} else {
				// if server is not rechable...fallback to local db
				// await handleFetchLocalDbList();
				console.log(
					"useFetchDate: Local DB Data about to decrypt: ",
					localStripped
				);

				// const decryptedLocalItems = await handleListToDecrypt(localStripped);
				const decryptedLocalItems = await handleFetchLocalDbList();
				return decryptedLocalItems;
			}
		} catch (error) {
			console.error(error.response?.data?.msg, error);
			return await handleFetchLocalDbList();
			// throw new Error("Retrieving & Decrypting Data Failed");
		}
	};

	return { publicKeyRequest, handleFetchList };
};
