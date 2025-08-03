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
		payloadLink.download = `keyRing Backup (${new Date().toUTCString()})`;
		payloadLink.click();

		payloadLink.remove();
		URL.revokeObjectURL(payloadURL);
		return true;
	};
	return { saveToFile };
};
