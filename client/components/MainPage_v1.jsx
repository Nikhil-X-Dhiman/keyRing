/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { usePrivateInstance } from "../hooks/usePrivateInstance";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { TbBorderAll } from "react-icons/tb";
import { LuStar } from "react-icons/lu";
import { HiOutlineTrash } from "react-icons/hi2";

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
	const searchRef = useRef();
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
						return {
							id: itemID,
							name,
							user,
							passwd,
							uri,
							note,
							favourite: fav,
							trash,
						};
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

	const handleDeleteItem = async () => {
		if (pageMode === "All" || pageMode === "Fav") {
			const itemID = passwdList[itemIndex].id;
			try {
				const response = await privateInstance.patch(`/api/v1/item/${itemID}`, {
					trash: !passwdList[itemIndex].trash,
				});
				if (response.status === 200 && response.data.success) {
					setPasswdList((prev) => {
						const updatedList = [...prev];
						const item = updatedList[itemIndex];
						const updateItem = { ...item, trash: true };
						updatedList[itemIndex] = updateItem;
						return updatedList;
					});
				}
			} catch (error) {
				console.error(
					"Trash Mark Failed: ",
					error,
					error?.response?.data.msg || "Unknown Error!!!"
				);
			}
		} else if (pageMode === "Trash") {
			console.log("Handle Trash Del");

			const itemID = passwdList[itemIndex].id;
			console.log("Delete Item ID: ", itemID);

			try {
				const response = await privateInstance.delete(`/api/v1/item/${itemID}`);
				console.log(response);

				if (response.status === 200 && response.data.success === true) {
					setPasswdList((prev) => {
						console.log("Empty trash list update");

						const updatedPasswdList = prev.filter((_, i) => {
							return i !== itemIndex;
						});
						return updatedPasswdList;
					});
				}
			} catch (error) {
				console.error(
					"Delete Item Failed: ",
					error,
					error?.response?.data.msg || "Unknown Error!!!"
				);
			}
		}

		setMode(null);
	};

	const handleEmptyTrash = async () => {
		try {
			const response = await privateInstance.delete(`/api/v1/all/del`);
			console.log(response);
			console.log("Empty Trash: ", response.status, response.data.success);

			if (response.status === 200 && response.data.success === true) {
				setPasswdList((prev) => {
					let updatedList = [...prev];
					updatedList = passwdList.filter((item) => {
						return item.trash === false;
					});
					return updatedList;
				});
			}
		} catch (error) {
			console.error(
				"Empty Trash Error: ",
				error,
				error?.response?.data?.msg || "Unknown Error!!!"
			);
		}

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
		// TODO: Add created and updated time
		if (mode === "Edit") {
			const itemID = passwdList[itemIndex].id;
			try {
				const response = await privateInstance.put(
					`/api/v1/item/${itemID}`,
					focusItem
				);
				if (response.status === 200 && response.data.success === true) {
					setPasswdList((prev) => {
						const updatedList = [...prev];
						updatedList[itemIndex] = focusItem;
						return updatedList;
					});
					setMode("View");
				}
			} catch (error) {
				console.error(
					"Error occured while editing field: ",
					error,
					error?.response?.data.msg || "Unknown Error!!!"
				);
			}
		} else if (mode === "Add") {
			const itemID = uuidv4();
			const item = { ...focusItem, id: itemID };
			console.log("item: ", item);
			try {
				const response = await privateInstance.post(
					`/api/v1/item/${itemID}`,
					item
				);
				if (response.status === 201 && response.data.success === true) {
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

	const handleSearchClear = () => {
		setSearchItem("");
		searchRef.current?.focus();
	};

	return (
		// <main className="grid grid-cols-3 grid-rows-[auto_1fr] h-full">
		<main className="grid grid-cols-[10rem_20rem_1fr] grid-rows-[auto_1fr] h-full min-h-0">
			<section className="col-start-2 col-end-4 row-start-1 row-end-2 grid grid-cols-[1fr_10rem] justify-items-center p-2 border-b border-slate-700">
				{/* add search bar here */}
				{/* <h1>KeyRing</h1> */}
				<div className="w-full flex justify-center relative">
					<input
						type="search"
						name="app-search"
						id="app-search"
						// TODO: ADD search react-icon
						value={searchItem}
						onChange={(e) => setSearchItem(e.target.value)}
						placeholder={`Search ${
							pageMode === "All"
								? "vault"
								: pageMode === "Fav"
								? "favourites"
								: pageMode === "Trash"
								? "trash"
								: ""
						}`}
						ref={searchRef}
						className="focus:outline-none p-2 rounded-md border-1 border-gray-400 hover:border-gray-300 focus:border-gray-300 shadow-sm w-[70%] webkit-search-input transition-all"
					/>
					<i
						className={`relative right-7 top-3 cursor-pointer text-gray-100 ${
							searchItem ? "visible" : "invisible"
						}`}
						onClick={handleSearchClear}
					>
						<IoMdCloseCircleOutline />
					</i>
				</div>
				<button
					onClick={handleLogout}
					className="bg-red-800 hover:bg-red-700 text-slate-200 font-medium py-2 px-6 rounded-xs cursor-pointer shadow-md transition-all"
				>
					Logout
				</button>
			</section>

			<section className="col-start-1 col-end-2 row-start-1 row-end-3 content-center p-5 border-r border-slate-700">
				<ul className="flex flex-col gap-y-1.5">
					<li
						className={`flex items-center gap-x-1.5 hover:text-blue-500 ${
							pageMode === "All" ? "text-blue-400 font-medium" : ""
						} cursor-pointer`}
						onClick={() => setPageMode("All")}
					>
						<TbBorderAll className="text-lg" />
						<span>All Items</span>
					</li>
					<li
						className={`flex items-center gap-x-1.5 hover:text-blue-500 ${
							pageMode === "Fav" ? "text-blue-400 font-medium" : ""
						} cursor-pointer`}
						onClick={() => setPageMode("Fav")}
					>
						<LuStar className="text-lg" />
						<span>Favourites</span>
					</li>
					<li
						className={`flex items-center gap-x-1.5 hover:text-blue-500 ${
							pageMode === "Trash" ? "text-blue-400 font-medium" : ""
						} cursor-pointer`}
						onClick={() => setPageMode("Trash")}
					>
						<HiOutlineTrash className="text-lg" />
						<span>Trash</span>
					</li>
				</ul>
			</section>

			<section className="col-start-2 col-end-3 row-start-2 row-end-3 flex flex-col p-2 border-r border-slate-700 min-h-0">
				{/* Display all passwd list here */}
				<div className="grow overflow-y-auto">
					{/* {passwdList.length !== 0 ? ( */}
					{filteredList.length !== 0 ? (
						<ul className="flex flex-col gap-1">
							{filteredList.map((item) => (
								<li
									className={`hover:bg-slate-700 px-2 py-2 h-12 flex items-center gap-x-1 border-l-4 active:border-l-slate-400 cursor-pointer truncate ${
										item.id === passwdList[itemIndex]?.id && itemIndex !== null
											? "border-l-blue-400 bg-slate-700"
											: "border-l-transparent"
									}`}
									key={item.id}
									onClick={() => handleClickItem(item.id)}
								>
									<span className="w-8 h-8 bg-slate-500 rounded-full flex justify-center items-center font-medium text-slate-200 flex-shrink-0">
										{item.name.charAt(0).toUpperCase()}
									</span>
									<span className="truncate">{item.name}</span>
								</li>
							))}
						</ul>
					) : (
						<h2>Empty List</h2>
					)}
				</div>
				<div className="self-center w-full flex-shrink-0 p-2">
					<button
						className="bg-blue-400 hover:bg-blue-300 text-slate-800 font-medium py-2 px-4 w-full rounded-xl shadow-md cursor-pointer transition-all"
						onClick={handleAddItem}
						disabled={pageMode === "Trash"}
					>
						Add
					</button>
				</div>
			</section>

			<section className="col-start-3 col-end-4 row-start-2 row-end-3 bg-slate-900 p-5 flex flex-col min-h-0">
				<div className="grow overflow-y-auto pr-2">
					{/* Display view of passwd and edition of them here */}
					{(mode === "View" || mode === "Edit" || mode === "Add") && (
						<>
							<p className="text-slate-300 mb-4">
								{mode === "View" ? (
									<h3>ITEM INFORMATION</h3>
								) : mode === "Edit" ? (
									<h3>EDIT ITEM</h3>
								) : mode === "Add" ? (
									<h3>ADD ITEM</h3>
								) : null}
							</p>

							<div className="bg-slate-700 flex flex-col rounded-md overflow-hidden">
								<div className="flex flex-col border-b-1 border-slate-500 hover:bg-slate-600 py-3 px-3.5">
									<label className="text-slate-300 text-sm mb-1" htmlFor="name">
										Name
									</label>
									<input
										type="text"
										name="name"
										id="name"
										value={
											mode === "View"
												? passwdList[itemIndex]?.name || ""
												: focusItem?.name || ""
										}
										onChange={handleInputChange}
										readOnly={mode === "View"}
										ref={nameRef}
										className={`${
											mode === "View" ? "focus:outline-none" : ""
										} cursor-default bg-transparent border-none text-white w-full`}
									/>
								</div>

								<div className="flex flex-col border-b-1 border-slate-500 hover:bg-slate-600 py-3 px-3.5">
									<label className="text-slate-300 text-sm mb-1" htmlFor="user">
										Username
									</label>
									<input
										type="text"
										name="user"
										id="user"
										value={
											mode === "View"
												? passwdList[itemIndex]?.user || ""
												: focusItem?.user || ""
										}
										onChange={handleInputChange}
										readOnly={mode === "View"}
										className={`${
											mode === "View" ? "focus:outline-none" : ""
										} cursor-default bg-transparent border-none text-white w-full`}
									/>
								</div>

								<div className="flex flex-col border-b-1 border-slate-500 hover:bg-slate-600 py-3 px-3.5">
									<label
										className="text-slate-300 text-sm mb-1"
										htmlFor="passwd"
									>
										Password
									</label>
									<input
										type="password"
										name="passwd"
										id="passwd"
										value={
											mode === "View"
												? passwdList[itemIndex]?.passwd || ""
												: focusItem?.passwd || ""
										}
										onChange={handleInputChange}
										readOnly={mode === "View"}
										className={`${
											mode === "View" ? "focus:outline-none" : ""
										} cursor-default bg-transparent border-none text-white w-full`}
									/>
								</div>
							</div>

							<div className="bg-slate-700 flex flex-col my-7 rounded-md overflow-hidden">
								{/* View Mode URI List */}
								{passwdList.length !== 0 &&
									mode === "View" &&
									itemIndex !== null &&
									passwdList[itemIndex].uri.map((item, i) => (
										<div
											className="flex flex-col border-b-1 border-slate-500 hover:bg-slate-600 py-3 px-3.5"
											key={`uri-${i}`}
										>
											<label
												className="text-slate-300 text-sm mb-1"
												htmlFor={`uri-${i}`}
											>{`URI ${i + 1}`}</label>
											<input
												type="text"
												name={`uri-${i}`}
												id={`uri-${i}`}
												value={item || ""}
												readOnly
												className="focus:outline-none cursor-default bg-transparent border-none text-white w-full break-all"
											/>
										</div>
									))}
								{/* Add mode URI List and Edit mode */}
								{focusItem.uri.length !== 0 &&
								(mode === "Edit" || mode === "Add")
									? focusItem.uri.map((item, i) => (
											<div
												className="flex flex-col border-b-1 border-slate-500 hover:bg-slate-600 py-3 px-3.5"
												key={`uri-${i}`}
											>
												<label
													className="text-slate-300 text-sm mb-1"
													htmlFor={`edit-uri-${i}`}
												>{`URI ${i + 1}`}</label>
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
													className="bg-transparent border-none text-white w-full focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2 py-1"
												/>
											</div>
									  ))
									: null}
								{mode === "Add" || mode === "Edit" ? (
									<div className="p-3">
										<button
											onClick={handleNewURI}
											className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-colors"
										>
											New URI
										</button>
									</div>
								) : null}
							</div>
							{mode === "View" && passwdList[itemIndex]?.note ? (
								<div className="mb-6">
									<h3 className="text-slate-300 mb-2">NOTES</h3>
									<textarea
										name="item-notes"
										id="item-notes"
										value={passwdList[itemIndex]?.note || ""}
										readOnly
										className="focus:outline-none cursor-default w-full h-60 bg-slate-700 text-white p-3 rounded-md resize-none border-none"
									></textarea>
								</div>
							) : null}
							{mode === "Edit" || mode === "Add" ? (
								<div className="mb-6">
									<h3 className="text-slate-300 mb-2">NOTES</h3>
									<textarea
										name="note"
										id="note"
										value={focusItem.note || ""}
										onChange={handleInputChange}
										className="w-full h-60 bg-slate-700 text-white p-3 rounded-md resize-none border-none focus:outline-none focus:ring-1 focus:ring-blue-400"
									></textarea>
								</div>
							) : null}
							{mode === "Add" ||
							mode === "Edit" ||
							(mode === "View" && passwdList[itemIndex]?.favourite) ? (
								<div className="flex items-center gap-2 mb-6">
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
										className="w-4 h-4"
									/>
									<label htmlFor="favourite" className="text-slate-300">
										Favourite
									</label>
								</div>
							) : null}
						</>
					)}
				</div>
				<div className="flex-shrink-0 flex flex-wrap gap-2 pt-4 border-t border-slate-700">
					{mode === "View" && (
						// TODO: Refactor Code here
						<>
							{pageMode === "Trash" ? null : (
								<button
									onClick={handleEditItem}
									className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors"
								>
									Edit
								</button>
							)}

							{pageMode === "Trash" && (
								<button
									onClick={handleEmptyTrash}
									className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition-colors"
								>
									Empty Trash
								</button>
							)}
							<button
								onClick={handleDeleteItem}
								className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition-colors"
							>
								Delete
							</button>
							{pageMode === "Trash" && (
								<button
									onClick={handleRestore}
									className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition-colors"
								>
									Restore
								</button>
							)}

							<button
								onClick={handleClose}
								className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
							>
								Close
							</button>
						</>
					)}
					{mode === "Edit" && (
						<>
							<button
								onClick={handleSaveItem}
								className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition-colors"
							>
								Save
							</button>
							<button
								onClick={handleCancel}
								className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteItem}
								className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition-colors"
							>
								Delete
							</button>
						</>
					)}
					{mode === "Add" && (
						<>
							<button
								onClick={handleSaveItem}
								className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition-colors"
							>
								Save
							</button>
							<button
								onClick={handleCancel}
								className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
							>
								Cancel
							</button>
						</>
					)}
				</div>
			</section>
		</main>
	);
};
