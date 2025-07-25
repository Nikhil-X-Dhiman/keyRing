import { useEffect, useState } from "react";

export const useLocalStorage = (key, initValue) => {
	const [value, setValue] = useState(
		JSON.parse(localStorage.getItem(key)) || initValue
	);

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value, key]);

	return [value, setValue];
};
