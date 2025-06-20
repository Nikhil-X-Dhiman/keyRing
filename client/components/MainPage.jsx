// import { useRef, useState } from "react";
// import { v4 as uuidv4 } from "uuid";

import React, { useState } from "react";

// export const MainPage = () => {
// 	const defaultValues = {
// 		name: "",
// 		username: "",
// 		passwd: "",
// 		notes: "",
// 		uri: [],
// 	};
// 	// Display Passwd List
// 	const [passwdList, setPasswdList] = useState([]);
// 	// Display Passwd Item
// 	const [selectPasswdItem, setSelectPasswdItem] = useState(false);
// 	const [showSelectPasswd, setShowSelectPasswd] = useState(null);
// 	// Display Edit Passwd Dialog
// 	const [selectEdit, setSelectEdit] = useState(false);
// 	const [editPasswd, setEditPasswd] = useState(defaultValues);
// 	// dynamic uri input add
// 	const editURIRefs = useRef([]);

// 	// Display for adding new passwd
// 	const [selectAddPasswd, setSelectAddPasswd] = useState(false);
// 	const [newPasswd, setNewPasswd] = useState(defaultValues);
// 	// Edit URI List
// 	// const [selectNewURI, setSelectNewURI] = useState(false);
// 	const [newURI, setNewURI] = useState("");
// 	const [newURIList, setNewURIList] = useState([]);
// 	// dynamically add the ref to the input
// 	const addURIRefs = useRef([]);
// 	// const [selectURI, setSelectURI] = useState(false);

// 	const handlePasswdItemClick = (passwdItem) => {
// 		setSelectAddPasswd(false); // close add form
// 		setSelectEdit(false); // close edit form
// 		if (selectPasswdItem && showSelectPasswd.id === passwdItem.id) {
// 			// close the display passwd box if same entry is selected
// 			setSelectPasswdItem(false); // close edit form
// 			setShowSelectPasswd(null); // clear tmp selected password
// 		} else {
// 			setShowSelectPasswd(passwdItem); // store selected password item
// 			setSelectPasswdItem(true); // display select password box
// 		}
// 	};

// 	const handleAddItemClick = () => {
// 		setSelectAddPasswd(true); // open add form
// 		setSelectPasswdItem(false); // close select password view
// 		setShowSelectPasswd(null); // clear tmp selected password
// 		setNewPasswd(defaultValues); // reset add form
// 		setNewURIList([]); // reset URI list
// 		setNewURI(""); // reset uri input
// 	};

// 	const handleNewItemSave = () => {
// 		let finalURIList = [...newURIList];

// 		if (newURI.trim() !== "") {
// 			finalURIList.push(newURI.trim());
// 		}
// 		setPasswdList((prev) => [
// 			...prev,
// 			{ id: uuidv4(), ...newPasswd, uri: finalURIList },
// 		]); // add new passwd to list
// 		setSelectAddPasswd(false); // close add form
// 		setNewPasswd(defaultValues); // reset new passwd input fields
// 		setNewURIList([]); // reset uri list to empty
// 		setNewURI(""); // reset uri input
// 	};

// 	const handleNewItemCancel = () => {
// 		setSelectAddPasswd(false);
// 		setNewPasswd(defaultValues);
// 		setNewURIList([]);
// 		setNewURI("");
// 	};

// 	const handleEditItem = () => {
// 		setEditPasswd(showSelectPasswd); // edit form with current display data
// 		setSelectEdit(true); // open edit form
// 		setNewURIList(showSelectPasswd?.uri || []); // pass uri data for editing
// 	};

// 	const handleDeleteItem = () => {
// 		const updatedItemList = passwdList.filter(
// 			(item) => item.id !== showSelectPasswd.id
// 		);
// 		setPasswdList(updatedItemList);
// 		setSelectPasswdItem(false);
// 		setShowSelectPasswd(null);
// 	};

// 	const handleSaveEditItem = () => {
// 		let updatedItemList = passwdList.filter(
// 			(item) => item.id !== editPasswd.id
// 		);
// 		setEditPasswd((prev) => {
// 			return { ...prev, uri: newURIList };
// 		});
// 		updatedItemList = [...updatedItemList, editPasswd];
// 		setPasswdList(updatedItemList);
// 		setShowSelectPasswd(editPasswd);
// 		// setPasswdList((prev) => {
// 		// 	return { ...prev, uri: [...newURIList] };
// 		// });
// 		setNewURIList([]);
// 		setNewURI("");
// 		setSelectEdit(false);
// 		setEditPasswd(defaultValues);
// 	};

// 	const handleCancelEditItem = () => {
// 		setSelectEdit(false);
// 		setEditPasswd(defaultValues);
// 		setNewURIList([]);
// 		setNewURI("");
// 	};

// 	const handleNewURI = () => {
// 		setNewURIList((prev) => [...prev, " "]);
// 		setNewURI("");
// 	};

// 	const handleURIUpdate = (index, value) => {
// 		setNewURIList((prev) => {
// 			let newArr = [...prev];
// 			newArr[index] = value;
// 			return newArr;
// 		});
// 	};

// 	const handleNewURIChange = (e) => {
// 		setNewURI(e.target.value);
// 	};

// 	return (
// 		<main>
// 			<section>
// 				<ul>
// 					<li>All Items</li>
// 					<li>Favorites</li>
// 					<li>Trash</li>
// 				</ul>
// 			</section>
// 			<section>
// 				{/* passwd list is shown here */}
// 				<ul>
// 					{passwdList.map((passwdItem) => (
// 						<li
// 							key={`${passwdItem.id}`}
// 							onClick={() => handlePasswdItemClick(passwdItem)}
// 						>{`${passwdItem.name}`}</li>
// 					))}
// 				</ul>
// 				<div>
// 					<button onClick={handleAddItemClick}>+</button>
// 				</div>
// 			</section>
// 			<section>
// 				{selectPasswdItem ? (
// 					<>
// 						<h2>ITEM Information</h2>
// 						<div>
// 							{showSelectPasswd.name ? (
// 								<>
// 									<label htmlFor="item-name">Name</label>
// 									<input
// 										type="text"
// 										id="item-name"
// 										value={selectEdit ? editPasswd.name : showSelectPasswd.name}
// 										onChange={
// 											selectEdit
// 												? (e) =>
// 														setEditPasswd((prev) => ({
// 															...prev,
// 															name: e.target.value,
// 														}))
// 												: undefined
// 										}
// 										readOnly={!selectEdit}
// 									/>
// 								</>
// 							) : (
// 								""
// 							)}
// 							{showSelectPasswd.username ? (
// 								<>
// 									<label htmlFor="item-username">Username</label>
// 									<input
// 										type="text"
// 										id="item-username"
// 										value={
// 											selectEdit
// 												? editPasswd.username
// 												: showSelectPasswd.username
// 										}
// 										onChange={(e) =>
// 											setEditPasswd((prev) => ({
// 												...prev,
// 												username: e.target.value,
// 											}))
// 										}
// 										readOnly={!selectEdit}
// 									/>
// 								</>
// 							) : (
// 								""
// 							)}
// 							{showSelectPasswd.passwd ? (
// 								<>
// 									<label htmlFor="item-passwd">Password</label>
// 									<input
// 										type="password"
// 										id="item-passwd"
// 										value={
// 											selectEdit ? editPasswd.passwd : showSelectPasswd.passwd
// 										}
// 										onChange={(e) =>
// 											setEditPasswd((prev) => ({
// 												...prev,
// 												passwd: e.target.value,
// 											}))
// 										}
// 										readOnly={!selectEdit}
// 									/>
// 								</>
// 							) : (
// 								""
// 							)}
// 						</div>
// 						<div>
// 							{showSelectPasswd.uri && showSelectPasswd.uri.length > 0 ? (
// 								<>
// 									<ul>
// 										{showSelectPasswd.uri.map((currURI, index) => (
// 											<li key={`${index}${currURI}`}>
// 												<label htmlFor={`uri-${index}`}>URI</label>
// 												<input
// 													type="text"
// 													id={`uri-${index}`}
// 													defaultValue={currURI}
// 													// value={selectURI ? newURI : currURI}
// 													readOnly={!selectEdit}
// 													// onFocus={(e)=>setNewURI(currURI)}
// 													// onChange={}
// 													onBlur={(e) => {
// 														setNewURIList((prev) => {
// 															const newArr = [...prev];
// 															newArr[index] = e.target.value;
// 															return [...newArr];
// 														});
// 													}}
// 												/>
// 											</li>
// 										))}
// 									</ul>
// 								</>
// 							) : (
// 								""
// 							)}
// 						</div>
// 						{/* TODO: Add update and created at here */}

// 						<div>
// 							{/* TODO: Replace Text with img */}
// 							{selectEdit ? (
// 								<>
// 									<button onClick={handleSaveEditItem}>Save</button>
// 									<button onClick={handleCancelEditItem}>Cancel</button>
// 								</>
// 							) : (
// 								<>
// 									<button onClick={handleEditItem}>Edit</button>
// 									<button onClick={handleDeleteItem}>Delete</button>
// 								</>
// 							)}
// 						</div>
// 					</>
// 				) : selectAddPasswd ? (
// 					<>
// 						<h2>ADD Item</h2>
// 						<div>
// 							<label htmlFor="input-name">Name</label>
// 							<input
// 								type="text"
// 								id="input-name"
// 								value={newPasswd.name}
// 								onChange={(e) =>
// 									setNewPasswd((prev) => ({ ...prev, name: e.target.value }))
// 								}
// 							/>
// 							<label htmlFor="input-username">Username</label>
// 							<input
// 								type="text"
// 								id="input-username"
// 								value={newPasswd.username}
// 								onChange={(e) =>
// 									setNewPasswd((prev) => ({
// 										...prev,
// 										username: e.target.value,
// 									}))
// 								}
// 							/>
// 							<label htmlFor="input-passwd">Password</label>
// 							<input
// 								type="password"
// 								id="input-passwd"
// 								value={newPasswd.passwd}
// 								onChange={(e) =>
// 									setNewPasswd((prev) => ({ ...prev, passwd: e.target.value }))
// 								}
// 							/>
// 							<label htmlFor="input-uri">URI</label>
// 							{newPasswd.uri ? (
// 								<>
// 									{newPasswd.uri.map((item, index) => (
// 										<input
// 											type="text"
// 											id={`URI:${index}`}
// 											// readOnly={!selectEdit}
// 											value={item}
// 											onFocus={() => {
// 												setNewURI(item);
// 											}}
// 											onChange={(e) => setNewURI(e.target.value)}
// 											onBlur={() => {
// 												setNewURIList((prev) => {
// 													const newArr = [...prev];
// 													newArr[index] = newURI;
// 													setNewURI("");
// 													return [...newArr];
// 												});
// 											}}
// 										/>
// 									))}
// 								</>
// 							) : (
// 								""
// 							)}
// 							<input
// 								type="text"
// 								id={`URI:${newPasswd.uri.length}`}
// 								value={newURI}
// 								onChange={(e) => setNewURI(e.target.value)}
// 								onBlur={() => {
// 									setNewURIList((prev) => {
// 										const newArr = [...prev, newURI];
// 										setNewURI("");
// 										return newArr;
// 									});
// 								}}
// 							/>
// 							<button onClick={handleNewURI}>New URI</button>
// 							<h2>NOTES</h2>
// 							<textarea
// 								id="input-notes"
// 								value={newPasswd.notes}
// 								onChange={(e) =>
// 									setNewPasswd((prev) => ({ ...prev, notes: e.target.value }))
// 								}
// 							></textarea>
// 						</div>
// 						<div>
// 							<button onClick={handleNewItemSave}>Save</button>
// 							<button onClick={handleNewItemCancel}>Cancel</button>
// 						</div>
// 					</>
// 				) : (
// 					<h1>KeyRing</h1>
// 				)}
// 			</section>
// 		</main>
// 	);
// };

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

	const handleClickItem = (i) => {
		// Display Clicked Passwd View
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
			<section>{/* add search bar here */}</section>

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
							{passwdList.map((item, i) => (
								<li key={item.id} onClick={() => handleClickItem(i)}>
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
