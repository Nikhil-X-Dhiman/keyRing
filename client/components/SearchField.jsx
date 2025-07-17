import React from "react";

export const SearchField = React.forwardRef(
	({ searchItem, onChange, pageMode, onClick, Icon }, ref) => {
		return (
			<div className="w-full flex justify-center items-center relative">
				<input
					type="search"
					name="app-search"
					id="app-search"
					value={searchItem}
					onChange={onChange}
					placeholder={`🔍 Search ${
						pageMode === "All"
							? "vault"
							: pageMode === "Fav"
							? "favourites"
							: pageMode === "Trash"
							? "trash"
							: ""
					}`}
					autoComplete="off"
					ref={ref}
					className="focus:outline-none p-2 rounded-md border-1 border-gray-400 hover:border-gray-300 focus:border-gray-300 shadow-sm w-[70%] webkit-search-input transition-all"
				/>
				<i
					className={`ml-[-2.2rem] cursor-pointer text-gray-100 ${
						searchItem ? "visible" : "invisible"
					}`}
					onClick={onClick}
				>
					{Icon && <Icon className="w-5 h-5" />}
				</i>
			</div>
		);
	}
);
