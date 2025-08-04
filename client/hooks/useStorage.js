export const useStorage = () => {
	const saveToFile = (payload) => {
		if (!payload) {
			console.error("No Data is to Store");
		}
		payload = JSON.stringify(payload, null, 2);
		const payloadBlob = new Blob([payload], { type: "application/json" });

		const payloadURL = URL.createObjectURL(payloadBlob);

		const payloadLink = document.createElement("a");
		payloadLink.href = payloadURL;
		// name of file
		payloadLink.download = `keyRing Backup (${new Date().toUTCString()}).json`;
		payloadLink.click();

		payloadLink.remove();
		URL.revokeObjectURL(payloadURL);
		return true;
	};

	const restoreFromFile = async (event) => {
		console.log("readFromFile: Events: ", event);
		const localJSONFile = event.target.files[0];
		if (!localJSONFile) {
			console.error("No File Selected");
			return;
		}
		if (localJSONFile.type !== "application/json") {
			console.error("Invalid File Selected");
			return;
		}

		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const parsedFile = JSON.parse(e.target.result);
					if (Array.isArray(parsedFile)) {
						console.log("Imported Data: ", parsedFile);
						resolve(parsedFile);
					} else {
						console.error("JSON is not an Array of Objects");
						reject(new Error("JSON is not an Array of Objects"));
					}
				} catch (error) {
					console.error(
						"readFromFile: Error Occured while reading the file: ",
						error
					);
					reject(error);
					// return false;
				}
			};
			reader.onerror = (error) => {
				console.error("Error Reading File: ", error);
				reject(error.target.error);
			};
			reader.readAsText(localJSONFile);
		});
	};
	return { saveToFile, readFromFile: restoreFromFile };
};
