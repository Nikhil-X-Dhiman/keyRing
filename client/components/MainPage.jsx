import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const MainPage = () => {
	const defaultEmpty = {
		id: undefined,
		name: "",
		user: "",
		passwd: "",
		uri: [""],
		note: "",
		favourite: false,
		trash: false,
	};
	const [passwdList, setPasswdList] = useState([]); // list of passwd items
	// const [newPasswd, setNewPasswd] = useState(defaultEmpty); // add view storage here
	const [itemIndex, setItemIndex] = useState(null); // index for add, edit and view
	const [focusItem, setFocusItem] = useState(defaultEmpty); // passwd item for edit and add mode
	const [mode, setMode] = useState(null); // modes for different view selection
	const [searchItem, setSearchItem] = useState("");

	const filteredList = passwdList.filter((item) => {
		return (
			item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
			item.user.toLowerCase().includes(searchItem.toLowerCase())
		);
	});

	const handleAddItem = () => {
		// Adding new passwd entry btn
		setMode((prev) => {
			// Changing mode to display add form
			if (prev === null || prev === "Edit" || prev === "View") {
				return "Add";
			} else {
				return null; // click again to close the add form
			}
		});
		// setNewPasswd(defaultEmpty); // reset newPasswd
		setFocusItem(defaultEmpty);
	};

	const handleInputChange = (e) => {
		if (mode === "Edit" || mode === "Add") {
			const { name, value } = e.target;
			setFocusItem((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleNewURI = () => {
		if (mode === "Edit" || mode === "Add") {
			setFocusItem((prev) => {
				const newURIs = [...prev.uri];
				newURIs.push("");
				return { ...prev, uri: newURIs };
			});
		}
	};

	const handleEditItem = () => {
		// setFocusItem((prev) => {
		// 	const item = passwdList[itemIndex];
		// 	return { ...item };
		// });
		setFocusItem(passwdList[itemIndex] || "");
		setMode((prev) => {
			if (prev === null || prev === "Add" || prev === "View") {
				return "Edit";
			} else {
				return null;
			}
		});
	};

	const handleDeleteItem = () => {
		setPasswdList((prev) => {
			const updatedPasswdList = prev.filter((item, i) => {
				return i !== itemIndex;
			});
			return updatedPasswdList;
		});
		setMode(null);
	};

	const handleCancel = () => {
		if (mode === "Edit") {
			setFocusItem(defaultEmpty);
			setMode("View");
		} else if (mode === "Add") {
			setFocusItem(defaultEmpty);
			setMode(null);
		}
	};

	const handleClose = () => {
		setItemIndex(null);
		setFocusItem(defaultEmpty);
		setMode(null);
	};

	const handleSaveItem = () => {
		if (mode === "Edit") {
			setPasswdList((prev) => {
				const updatedList = [...prev];
				updatedList[itemIndex] = focusItem;
				return updatedList;
			});
		} else if (mode === "Add") {
			setPasswdList((prev) => {
				const updatedList = [...prev];
				// updatedList.push(focusItem);
				updatedList.push({ ...focusItem, id: uuidv4() });
				setItemIndex(updatedList.length - 1);
				return updatedList;
			});
			// setItemIndex(passwdList.length);
		}
		setMode("View");
		setFocusItem(defaultEmpty);
	};

	const handleClickItem = (id) => {
		// Display Clicked Passwd View
		let i = passwdList.findIndex((item) => item.id === id); // find index uring id
		setItemIndex(i); // setting index to show that passwd item
		setMode((prev) => {
			// setting mode to view the clicked passwd item
			if (
				prev === null ||
				prev === "Add" ||
				prev === "Edit" ||
				prev === "View"
			) {
				return "View";
			} else {
				return null; // click again to close the view from
			}
		});
	};

	return (
		<>
			<section>
				{/* add search bar here */}
				<h1>KeyRing</h1>
				<input
					type="search"
					name="app-search"
					id="app-search"
					// TODO: ADD search react-icon
					value={searchItem}
					onChange={(e) => setSearchItem(e.target.value)}
					placeholder="🔍Search"
				/>
			</section>

			<section>
				<ul>
					<li>All Items</li>
					<li>Favourites</li>
					<li>Trash</li>
				</ul>
			</section>

			<section>
				{/* Display all passwd list here */}
				<div>
					{/* {passwdList.length !== 0 ? ( */}
					{filteredList.length !== 0 ? (
						<ul>
							{filteredList.map((item) => (
								<li key={item.id} onClick={() => handleClickItem(item.id)}>
									{item.name}
								</li>
							))}
						</ul>
					) : (
						<h2>Empty List</h2>
					)}
				</div>
				<div>
					<button onClick={handleAddItem}>Add</button>
				</div>
			</section>

			<section>
				<div>
					{/* Display view of passwd and edition of them here */}
					{(mode === "View" || mode === "Edit" || mode === "Add") && (
						<>
							{mode === "View" ? (
								<h3>ITEM INFORMATION</h3>
							) : mode === "Edit" ? (
								<h3>EDIT ITEM</h3>
							) : mode === "Add" ? (
								<h3>ADD ITEM</h3>
							) : null}
							<div>
								<label htmlFor="name">Name</label>
								<input
									type="text"
									name="name"
									id="name"
									value={
										mode === "View"
											? passwdList[itemIndex].name || ""
											: focusItem.name || ""
									}
									onChange={handleInputChange}
									readOnly={mode === "View"}
								/>

								<label htmlFor="user">Username</label>
								<input
									type="text"
									name="user"
									id="user"
									value={
										mode === "View"
											? passwdList[itemIndex].user || ""
											: focusItem.user || ""
									}
									onChange={handleInputChange}
									readOnly={mode === "View"}
								/>

								<label htmlFor="passwd">Password</label>
								<input
									type="password"
									name="passwd"
									id="passwd"
									value={
										mode === "View"
											? passwdList[itemIndex].passwd || ""
											: focusItem.passwd || ""
									}
									onChange={handleInputChange}
									readOnly={mode === "View"}
								/>
							</div>

							<div>
								{/* View Mode URI List */}
								{passwdList.length !== 0 &&
									mode === "View" &&
									itemIndex !== null &&
									passwdList[itemIndex].uri.map((item, i) => (
										<React.Fragment key={`uri-${i}`}>
											<label htmlFor={`uri-${i}`}>{`URI ${i + 1}`}</label>
											<input
												type="text"
												name={`uri-${i}`}
												id={`uri-${i}`}
												// value={mode === "View" ? item : null}
												value={item || ""}
												readOnly
											/>
										</React.Fragment>
									))}
								{/* Add mode URI List and Edit mode */}
								{focusItem.uri.length !== 0 &&
								(mode === "Edit" || mode === "Add")
									? focusItem.uri.map((item, i) => (
											<React.Fragment key={`uri-${i}`}>
												<label htmlFor={`edit-uri-${i}`}>{`URI ${
													i + 1
												}`}</label>
												<input
													type="text"
													name={`edit-uri-${i}`}
													id={`edit-uri-${i}`}
													value={item || ""}
													onChange={(e) => {
														setFocusItem((prev) => {
															const newURIs = [...prev.uri];
															newURIs[i] = e.target.value;
															return { ...prev, uri: newURIs };
														});
													}}
												/>
											</React.Fragment>
									  ))
									: null}
								{/* input URI field for no URI emtry */}
								{/* {mode === "Add" && focusItem.uri.length === 0 && (
									<>
										<label htmlFor="add-uri">URI</label>
										<input
											type="text"
											name="add-uri"
											id="add-uri"
											value={focusItem.uri.length === 0 ? "" : focusItem.uri[0]}
											onChange={(e) => {
												// setFocusItem([e.target.value]);
												setFocusItem((prev) => ({
													...prev,
													uri: [e.target.value],
												}));
											}}
										/>
									</>
								)} */}
								{/* Add button for URI */}
								{mode === "Add" || mode === "Edit" ? (
									<button onClick={handleNewURI}>New URI</button>
								) : null}
							</div>
							{mode === "View" && passwdList[itemIndex]?.note ? (
								<div>
									<h3>NOTES</h3>
									<textarea
										name="item-notes"
										id="item-notes"
										value={passwdList[itemIndex]?.note || ""}
										readOnly
									></textarea>
								</div>
							) : null}
							{mode === "Edit" || mode === "Add" ? (
								<div>
									<h3>NOTES</h3>
									<textarea
										name="item-notes"
										id="item-notes"
										value={focusItem.note || ""}
										onChange={(e) => {
											setFocusItem((prev) => {
												return { ...prev, note: e.target.value };
											});
										}}
									></textarea>
								</div>
							) : null}
						</>
					)}
				</div>
				<div>
					{mode === "View" && (
						<>
							<button onClick={handleEditItem}>Edit</button>
							<button onClick={handleDeleteItem}>Delete</button>
							<button onClick={handleClose}>Close</button>
						</>
					)}
					{mode === "Edit" && (
						<>
							<button onClick={handleSaveItem}>Save</button>
							<button onClick={handleCancel}>Cancel</button>
							<button onClick={handleDeleteItem}>Delete</button>
						</>
					)}
					{mode === "Add" && (
						<>
							<button onClick={handleSaveItem}>Save</button>
							<button onClick={handleCancel}>Cancel</button>
						</>
					)}
				</div>
			</section>
		</>
	);
};
