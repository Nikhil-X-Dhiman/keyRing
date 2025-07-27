import { HashLoader } from "react-spinners";

export const Loading = ({ loading, message = "Please Wait..." }) => {
	return (
		<div className="bg-slate-800 h-screen w-full flex flex-col justify-center items-center gap-3.5 text-black">
			{loading && <HashLoader size={150} />}
			{loading ? (
				<span className="text-2xl font-bold">{message}</span>
			) : (
				"Login"
			)}
		</div>
	);
};
