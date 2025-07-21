import { useState } from "react";
import { AppContext } from "./AppContextObject";

export const AppProvider = ({ children }) => {
	const defaultAppValues = {
		vault: "unlock",
		persist: false,
		login: false,
	};

	const [appState, setAppState] = useState(defaultAppValues);

	const [loadingCount, setLoadingCount] = useState(0);

	const startLoading = () => {
		setLoadingCount((prev) => prev + 1);
	};

	const endLoading = () => {
		setLoadingCount((prev) => Math.max(0, prev - 1));
	};

	const resetLoading = () => setLoadingCount(0);

	const loading = loadingCount > 0;

	return (
		<AppContext.Provider
			value={{
				appState,
				setAppState,
				loading,
				startLoading,
				endLoading,
				resetLoading,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
