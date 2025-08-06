import { memo, useMemo } from "react";
import { FcSearch } from "react-icons/fc";

export const EmptyList = memo(() => {
	const FcSearchContent = useMemo(() => {
		return <FcSearch className="text-7xl" />;
	}, []);
	return (
		<div className="flex flex-col justify-center items-center h-full gap-3 animate-fade-in">
			{/* added animation can be removed if facing problems */}
			{FcSearchContent}
			<h2 className="text-slate-300">Empty List</h2>
		</div>
	);
});
