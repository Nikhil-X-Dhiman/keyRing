import { useApp } from "../../hooks/useApp";
import { Loading } from "../pages/Loading";

export const GlobalLoadingSpinner = () => {
	const { loading } = useApp(); // or useLoadingContext
	return false ? <Loading loading={loading} /> : null;
};
