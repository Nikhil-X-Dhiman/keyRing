/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { usePrivateInstance } from "../hooks/usePrivateInstance";

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

	// fetch data from the server and save it to the server only then save the to local too
	const [passwdList, setPasswdList] = useState([]); //
	const [itemIndex, setItemIndex] = useState(null); // index for add, edit and view
	const [focusItem, setFocusItem] = useState(defaultEmpty); // passwd item for edit and add mode
	const [mode, setMode] = useState(null); // modes for different view selection (null, view, edit, add)
	const [searchItem, setSearchItem] = useState("");
	const [pageMode, setPageMode] = useState("All");
	// all, fav, trash
	const nameRef = useRef();
	const navigate = useNavigate();
	const { setAuth } = useAuth();
	const privateInstance = usePrivateInstance();

	useEffect(() => {
		if ((mode === "Add" || mode === "Edit") && nameRef.current) {
			nameRef.current.focus();
		}
	}, [mode]);

	useEffect(() => {
		// TODO: Add created and updated time
		const getAllItems = async () => {
			try {
				const response = await privateInstance.get("/api/v1/all");
				const { success, result } = response.data;
				if (success) {
					const updatedList = result.map((item) => {
						const { itemID, name, user, passwd, uri, note, fav, trash } = item;
						return { id: itemID, name, user, passwd, uri, note, fav, trash };
					});
					setPasswdList(updatedList);
				}
			} catch (error) {
				console.error(error.response.data.msg);
			}
		};
		getAllItems();
		// setPasswdList()
	}, []);

	const filteredList = passwdList.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
			item.user.toLowerCase().includes(searchItem.toLowerCase());

		const matchesMode =
			(pageMode === "All" && item.trash === false) || // Only show if not in trash for "View"
			(pageMode === "Fav" && item.favourite === true && item.trash === false) ||
			(pageMode === "Trash" && item.trash === true);

		return matchesSearch && matchesMode;
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

	const handleFavourite = () => {
		if (mode === "Edit" || mode === "Add") {
			setFocusItem((prev) => ({ ...prev, favourite: !prev.favourite }));
		}
	};

	const handleEditItem = () => {
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
		if (pageMode === "All" || pageMode === "Fav") {
			setPasswdList((prev) => {
				const updatedList = [...prev];
				const item = updatedList[itemIndex];
				const updateItem = { ...item, trash: true };
				updatedList[itemIndex] = updateItem;
				return updatedList;
			});
		} else if (pageMode === "Trash") {
			setPasswdList((prev) => {
				const updatedPasswdList = prev.filter((_, i) => {
					return i !== itemIndex;
				});
				return updatedPasswdList;
			});
		}

		setMode(null);
	};

	const handleEmptyTrash = () => {
		setPasswdList((prev) => {
			let updatedList = [...prev];
			updatedList = passwdList.filter((item) => {
				return item.trash === false;
			});
			return updatedList;
		});
		setMode(null);
	};

	const handleRestore = () => {
		setPasswdList((prev) => {
			const updatedList = [...prev];
			const item = updatedList[itemIndex];
			const updatedItem = { ...item, trash: false };
			updatedList[itemIndex] = updatedItem;
			return updatedList;
		});
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

	const handleSaveItem = async () => {
		if (mode === "Edit") {
			setPasswdList((prev) => {
				const updatedList = [...prev];
				updatedList[itemIndex] = focusItem;
				return updatedList;
			});
		} else if (mode === "Add") {
			const item = { ...focusItem, id: uuidv4() };
			console.log("item: ", item);
			try {
				const response = await privateInstance.post("/api/v1/item", item);
				if (response.status === 200 && response.data.success === true) {
					setPasswdList((prev) => {
						const updatedList = [...prev];
						updatedList.push(item);
						setItemIndex(updatedList.length - 1);
						setMode("View");
						setFocusItem(defaultEmpty);
						return updatedList;
					});
				} else {
					console.log("Unable to update DB...Check your Internet Connection.");
				}
			} catch (error) {
				console.error("Error Occured while adding Item: ", error);
			}
		}
	};

	const handleClickItem = (id) => {
		// Display Clicked Passwd View
		let prevItemIndex = itemIndex; // get old clicked item index
		let i = passwdList.findIndex((item) => item.id === id); // find index uring id
		setItemIndex(i); // setting index to show that passwd item
		setMode((prev) => {
			// setting mode to view the clicked passwd item
			if (
				prev === null ||
				prev === "Add" ||
				prev === "Edit" ||
				(prev === "View" && prevItemIndex !== i) // close view for same item click
			) {
				return "View";
			} else {
				return null; // click again to close the view from
			}
		});
	};

	const handleLogout = async () => {
		const response = await privateInstance.get("/api/v1/auth/logout", {
			withCredentials: true,
		});
		const success = response?.data?.success;
		const message = response?.data?.msg;
		console.log("logout response: ", response);

		console.log(success, message);

		if (response.status === 200) {
			console.log("logged out");
			localStorage.setItem("isLogged", JSON.stringify(false));
			navigate("/login/email");
			setAuth(null);
		}
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
					placeholder={`🔍 Search ${
						pageMode === "All"
							? "vault"
							: pageMode === "Fav"
							? "favourites"
							: pageMode === "Trash"
							? "trash"
							: ""
					}`}
				/>
				<button onClick={handleLogout}>Logout</button>
			</section>

			<section>
				<ul>
					<li onClick={() => setPageMode("All")}>All Items</li>
					<li onClick={() => setPageMode("Fav")}>Favourites</li>
					<li onClick={() => setPageMode("Trash")}>Trash</li>
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
					<button onClick={handleAddItem} disabled={pageMode === "Trash"}>
						Add
					</button>
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
									ref={nameRef}
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
							{mode === "Add" ||
							mode === "Edit" ||
							(mode === "View" && passwdList[itemIndex]?.favourite) ? (
								<>
									<label htmlFor="favourite">Favourite</label>
									<input
										type="checkbox"
										name="favourite"
										id="favourite"
										checked={
											mode === "View"
												? passwdList[itemIndex]?.favourite || false
												: mode === "Add" || mode === "Edit"
												? focusItem.favourite
												: false
										}
										onChange={handleFavourite}
										readOnly={mode === "View"}
									/>
								</>
							) : null}
						</>
					)}
				</div>
				<div>
					{mode === "View" && (
						<>
							{pageMode === "Trash" ? null : (
								<button onClick={handleEditItem}>Edit</button>
							)}

							{pageMode === "Trash" && (
								<button onClick={handleEmptyTrash}>Empty Trash</button>
							)}
							<button onClick={handleDeleteItem}>Delete</button>
							{pageMode === "Trash" && (
								<button onClick={handleRestore}>Restore</button>
							)}

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
