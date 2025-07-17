import { EmptyList } from "./EmptyList";
import { ListItem } from "./ListItem";

export const DisplayList = ({
	filteredList,
	passwdList,
	itemIndex,
	handleClickItem,
}) => {
	return (
		<div className="overflow-y-scroll h-full">
			{filteredList.length !== 0 ? (
				<ul>
					<ListItem
						itemIndex={itemIndex}
						passwdList={passwdList}
						filteredList={filteredList}
						handleClickItem={handleClickItem}
					/>
				</ul>
			) : (
				<EmptyList />
			)}
		</div>
	);
};
