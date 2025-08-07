import { memo, useMemo } from "react";
import { GiRoundStar } from "react-icons/gi";

export const ListItem = memo(
	({ itemIndex, passwordList, handleClickItem, filteredList }) => {
		const GiRoundStarContent = useMemo(() => {
			return <GiRoundStar className="text-yellow-300" />;
		}, []);
		const listStyle = `hover:bg-slate-700 pl-2 pr-3 py-2 flex items-center justify-between gap-x-1 border-l-4  active:border-l-slate-400 cursor-pointer overflow-hidden`;

		return (
			<>
				{filteredList.map((item) => (
					<li
						role="button"
						tabIndex={0}
						className={`${listStyle} ${
							item.uuid === passwordList[itemIndex]?.uuid && itemIndex !== null
								? "border-l-blue-400 bg-slate-700"
								: "border-l-transparent"
						}`}
						key={item.uuid}
						onClick={() => handleClickItem(item.uuid)}
					>
						<div className="flex items-center gap-2 flex-1 min-w-0">
							{/* List Icon */}
							<span className="w-10 h-10 bg-slate-500 rounded-full flex justify-center items-center font-medium text-slate-200 flex-shrink-0 text-xl">
								{item.name.charAt(0).toUpperCase()}
							</span>

							{/* List Item Name */}
							<div className="flex-1 min-w-0">
								<p className="truncate overflow-hidden whitespace-nowrap">
									{item.name}
								</p>
								<p className="truncate overflow-hidden whitespace-nowrap">
									{item.user}
								</p>
							</div>

							{/* List Item Favourite's Star */}
						</div>
						{item.favourite && (
							<div className="flex-shrink-0">{GiRoundStarContent}</div>
						)}
					</li>
				))}
			</>
		);
	}
);
