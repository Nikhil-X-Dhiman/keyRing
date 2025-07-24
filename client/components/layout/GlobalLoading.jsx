import { useApp } from "../../hooks/useApp";
import { Loading } from "../pages/Loading";

export const GlobalLoadingSpinner = () => {
	const { loading } = useApp(); // or useLoadingContext
	return loading ?? true ? <Loading loading={loading ?? true} /> : null;
};
