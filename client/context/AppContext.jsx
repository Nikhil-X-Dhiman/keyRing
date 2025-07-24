import { useCallback, useRef, useState } from "react";
import { AppContext } from "./AppContextObject";

export const AppProvider = ({ children }) => {
	const initialAppStateValues = {
		vault: "unlock",
		persist: false,
		login: false,
	};

	const [loading, setLoading] = useState(true);

	const appState = useRef(initialAppStateValues);

	const initStateValues = useCallback(() => {
		appState.current = initialAppStateValues;
	}, []);

	return (
		<AppContext.Provider
			value={{
				appState,
				loading,
				setLoading,
				initStateValues,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
