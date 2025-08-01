import { memo } from "react";
import { EmptyList } from "./EmptyList";
import { ListItem } from "./ListItem";

export const DisplayList = memo(
	({ filteredList, passwordList, itemIndex, handleClickItem }) => {
		return (
			<div className="h-full">
				{filteredList.length !== 0 ? (
					<ul>
						<ListItem
							itemIndex={itemIndex}
							passwordList={passwordList}
							filteredList={filteredList}
							handleClickItem={handleClickItem}
						/>
					</ul>
				) : (
					<EmptyList />
				)}
			</div>
		);
	}
);
