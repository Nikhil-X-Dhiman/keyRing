import { useState } from "react";

export const MainPage = () => {
	const [itemList, setItemList] = useState();
	const [selectItem, setSelectItem] = useState();
	const [showItem, setShowItem] = useState(false);
	const [addItem, setAddItem] = useState(false);
	const [newItem, setNewItem] = useState({
		name: null,
		username: null,
		password: null,
		notes: null,
		uri: null,
	});

	return (
		<main>
			<section>
				<ul>
					<li>All Items</li>
					<li>Favorites</li>
					<li>Trash</li>
				</ul>
			</section>
			<section>
				<ul>
					<li>google</li>
					<li>microsoft</li>
				</ul>
				<div>
					<button>+</button>
				</div>
			</section>
		</main>
	);
};
