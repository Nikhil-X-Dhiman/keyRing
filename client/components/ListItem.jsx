import { GiRoundStar } from "react-icons/gi";

export const ListItem = ({
	itemIndex,
	passwdList,
	handleClickItem,
	filteredList,
}) => {
	const listStyle = `hover:bg-slate-700 pl-2 py-2 flex items-center justify-between gap-x-1 border-l-4  active:border-l-slate-400 cursor-pointer truncate`;

	return (
		<>
			{filteredList.map((item) => (
				<li
					role="button"
					tabIndex={0}
					className={`${listStyle} ${
						item.id === passwdList[itemIndex]?.id && itemIndex !== null
							? "border-l-blue-400 bg-slate-700"
							: "border-l-transparent"
					}`}
					key={item.id}
					onClick={() => handleClickItem(item.id)}
				>
					<div className="flex items-center gap-2">
						{/* List Icon */}
						<span className="w-10 h-10 bg-slate-500 rounded-full flex justify-center items-center font-medium text-slate-200 shrink-0 text-xl">
							{item.name.charAt(0).toUpperCase()}
						</span>

						{/* List Item Name */}
						<div>
							<p>
								{item.name.length > 40
									? item.name.slice(0, 37) + "..."
									: item.name}
							</p>
							<p>{item.user}</p>
						</div>

						{/* List Item Favourite's Star */}
					</div>
					{item.favourite && <GiRoundStar className="text-yellow-300" />}
				</li>
			))}
		</>
	);
};
