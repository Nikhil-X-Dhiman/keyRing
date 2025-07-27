/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useRef, useState } from "react";
import { AppContext } from "./AppContextObject";

export const AppProvider = ({ children }) => {
	const initialAppStateValues = {
		persist: false,
		online: false,
	};
	// Global Loading
	const [loading, setLoading] = useState(false);

	const appState = useRef(initialAppStateValues);

	const handleInitStateValues = useCallback(() => {
		appState.current = initialAppStateValues;
	}, []);

	return (
		<AppContext.Provider
			value={{
				appState,
				loading,
				setLoading,
				handleInitStateValues,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
