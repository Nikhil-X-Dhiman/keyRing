import { FcSearch } from "react-icons/fc";

export const EmptyList = () => {
	return (
		<div className="flex flex-col justify-center items-center h-full gap-3 animate-fade-in">
			{/* added animation can be removed if facing problems */}
			<FcSearch className="text-7xl" />
			<h2 className="text-slate-300">Empty List</h2>
		</div>
	);
};
