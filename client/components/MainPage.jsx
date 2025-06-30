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
import { FcSearch } from "react-icons/fc";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TbRestore } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { LuSave } from "react-icons/lu";
import { MdCloseFullscreen } from "react-icons/md";
import { MdOutlineAdd } from "react-icons/md";

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
	const areaRef = useRef();
	const navigate = useNavigate();
	const { setAuth } = useAuth();
	const privateInstance = usePrivateInstance();

	useEffect(() => {
		if ((mode === "Add" || mode === "Edit") && nameRef.current) {
			nameRef.current.focus();
		}
	}, [mode]);

	useEffect(() => {
		const textArea = areaRef?.current;
		if (textArea && mode === "View") {
			textArea.style.height = "auto";
			textArea.style.height = `${textArea.scrollHeight + 5}px`;
		} else if (textArea && (mode === "Edit" || mode === "Add")) {
			textArea.style.height = "auto";
			textArea.style.height = "175px";
		}
	}, [itemIndex, mode]);

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

	const handleFavouriteDiv = (e) => {
		if (e.target.type === "checkbox") {
			e.stopPropagation();
			console.log("checkbox");
			return;
		}
		if (mode === "Edit" || mode === "Add") {
			setFocusItem((prev) => ({ ...prev, favourite: !prev.favourite }));
		}
	};

	const handleFavouriteCheckbox = () => {
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
		setItemIndex(null);
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
		<main className="grid grid-cols-[10rem_20rem_1fr] grid-rows-[auto_1fr] h-full pl-5">
			<section className="col-start-2 col-end-4 row-start-1 row-end-2 grid grid-cols-[1fr_10rem] justify-items-center p-2 border-b border-slate-950">
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
					className="bg-red-800 hover:bg-red-700 text-slate-200 font-medium py-2 px-6 rounded-xl cursor-pointer shadow-md transition-all"
				>
					Logout
				</button>
			</section>

			<section className="col-start-1 col-end-2 row-start-1 row-end-3 content-center border-r border-slate-950">
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

			<section className="col-start-2 col-end-3 row-start-2 row-end-3 flex flex-col justify-between min-h-0">
				{/* min-h-0 for flex and grid to bend them to will of overflow */}
				{/* Display all passwd list here */}
				<div className="overflow-auto h-full">
					{/* {passwdList.length !== 0 ? ( */}
					{filteredList.length !== 0 ? (
						<ul className="flex flex-col gap-1">
							{filteredList.map((item) => (
								<li
									className={`hover:bg-slate-700 px-2 py-2 h-12 flex items-center gap-x-1 border-l-4  active:border-l-slate-400 cursor-pointer truncate ${
										item.id === passwdList[itemIndex]?.id && itemIndex !== null
											? "border-l-blue-400 bg-slate-700"
											: "border-l-transparent"
									}`}
									key={item.id}
									onClick={() => handleClickItem(item.id)}
								>
									<span className="w-8 h-8 bg-slate-500 rounded-full flex justify-center items-center font-medium text-slate-200 shrink-0">
										{item.name.charAt(0).toUpperCase()}
									</span>
									{item.name.length > 38
										? item.name.slice(0, 35) + "..."
										: item.name}
								</li>
							))}
						</ul>
					) : (
						<div className="flex flex-col justify-center items-center h-full gap-3">
							<FcSearch className="text-7xl" />
							<h2 className="text-slate-300">Empty List</h2>
						</div>
					)}
				</div>
				<div className="self-center w-full px-5 py-1.5 bg-slate-700 border-1 border-slate-950">
					{pageMode !== "Trash" ? (
						<button
							className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 flex justify-center font-medium py-2 w-full rounded shadow-2xl cursor-pointer  transition-all"
							onClick={handleAddItem}
							// disabled={pageMode === "Trash"}
							title="Add Item"
						>
							<MdOutlineAdd className="text-blue-400 text-xl" size={32} />
						</button>
					) : (
						<button
							className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 flex justify-center font-medium py-3.5 w-full rounded shadow-2xl cursor-pointer  transition-all text-sm"
							onClick={handleEmptyTrash}
							title="Add Item"
						>
							Empty Trash
						</button>
					)}
				</div>
			</section>

			<section className="col-start-3 col-end-4 row-start-2 row-end-3 bg-slate-900 pt-5 h-full min-h-0 flex flex-col justify-between">
				<div className="px-7 overflow-y-auto">
					{/* Display view of passwd and edition of them here */}
					{(mode === "View" || mode === "Edit" || mode === "Add") && (
						<>
							<p className="text-slate-300 mb-1">
								{mode === "View" ? (
									<h3>ITEM INFORMATION</h3>
								) : mode === "Edit" ? (
									<h3>EDIT ITEM</h3>
								) : mode === "Add" ? (
									<h3>ADD ITEM</h3>
								) : null}
							</p>

							<div className="bg-slate-700 flex flex-col">
								{(mode === "View" && passwdList[itemIndex]?.name) ||
								mode === "Add" ||
								mode === "Edit" ? (
									<div className="flex flex-col border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5">
										<label
											className="text-slate-300 text-sm
									"
											htmlFor="name"
										>
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
											} cursor-default`}
										/>
									</div>
								) : (
									""
								)}
								{(mode === "View" && passwdList[itemIndex]?.user) ||
								mode === "Add" ||
								mode === "Edit" ? (
									<div className="flex flex-col border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5">
										<label
											className="text-slate-300 text-sm
									"
											htmlFor="user"
										>
											Username
										</label>
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
											className={`${
												mode === "View" ? "focus:outline-none" : ""
											} cursor-default`}
										/>
									</div>
								) : (
									""
								)}
								{(mode === "View" && passwdList[itemIndex]?.passwd) ||
								mode === "Add" ||
								mode === "Edit" ? (
									<div className="flex flex-col border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5">
										<label
											className="text-slate-300 text-sm
									"
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
													? passwdList[itemIndex].passwd || ""
													: focusItem.passwd || ""
											}
											onChange={handleInputChange}
											readOnly={mode === "View"}
											className={`${
												mode === "View" ? "focus:outline-none" : ""
											} cursor-default`}
										/>
									</div>
								) : (
									""
								)}
							</div>

							<div className="bg-slate-700 flex flex-col my-7">
								{/* View Mode URI List */}
								{passwdList.length !== 0 &&
									mode === "View" &&
									itemIndex !== null &&
									passwdList[itemIndex].uri.map((item, i) => {
										return item === "" ? (
											""
										) : (
											<div
												className="flex flex-col border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5"
												key={`uri-${i}`}
											>
												<label
													className="text-slate-300 text-sm
									"
													htmlFor={`uri-${i}`}
												>{`URI ${i + 1}`}</label>
												<input
													type="text"
													name={`uri-${i}`}
													id={`uri-${i}`}
													// value={mode === "View" ? item : null}
													value={item || ""}
													readOnly
													className={`${
														mode === "View" ? "focus:outline-none" : ""
													} cursor-default`}
												/>
											</div>
										);
									})}
								{/* Add mode URI List and Edit mode */}
								{focusItem.uri.length !== 0 &&
								(mode === "Edit" || mode === "Add")
									? focusItem.uri.map((item, i) => (
											<div
												className="flex flex-col border-b-1 border-slate-500 hover:bg-slate-600 last:border-b-0 py-3 px-3.5"
												key={`uri-${i}`}
											>
												<label
													className="text-slate-300 text-sm
									"
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
												/>
											</div>
									  ))
									: null}
								{mode === "Add" || mode === "Edit" ? (
									<button
										className="flex items-center gap-1.5 hover:bg-slate-600 py-2 px-3.5 cursor-pointer"
										onClick={handleNewURI}
									>
										<IoMdAddCircleOutline className="text-2xl" />
										New URI
									</button>
								) : null}
							</div>
							{mode === "View" && passwdList[itemIndex]?.note ? (
								<div>
									<h3 className="text-slate-300">NOTES</h3>
									<textarea
										name="item-notes"
										id="item-notes"
										value={passwdList[itemIndex]?.note || ""}
										readOnly
										ref={areaRef}
										className={`${
											mode === "View" ? "focus:outline-none" : ""
										} cursor-default w-full bg-slate-700 py-1 px-3`}
									></textarea>
								</div>
							) : null}
							{mode === "Edit" || mode === "Add" ? (
								<div>
									<h3 className="text-slate-300">NOTES</h3>
									<textarea
										name="item-notes"
										id="item-notes"
										value={focusItem.note || ""}
										ref={areaRef}
										onChange={(e) => {
											setFocusItem((prev) => {
												return { ...prev, note: e.target.value };
											});
										}}
										className={`${
											mode === "Edit" || mode === "Add"
												? "focus:outline-none"
												: ""
										} cursor-default w-full bg-slate-700 p-2`}
									></textarea>
								</div>
							) : null}
							{/* Favourite Btn Here */}
							{mode === "Add" ||
							mode === "Edit" ||
							(mode === "View" && passwdList[itemIndex]?.favourite) ? (
								<div
									className="flex items-center justify-between gap-1.5 bg-slate-700 hover:bg-slate-600 py-2 px-3.5 cursor-pointer mt-5 mb-3"
									onClick={handleFavouriteDiv}
								>
									<label
										htmlFor="favourite"
										className="cursor-pointer"
										onClick={handleFavouriteCheckbox}
									>
										Favourite
									</label>
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
										onChange={handleFavouriteCheckbox}
										readOnly={mode === "View"}
										className="cursor-pointer scale-130"
									/>
								</div>
							) : null}
						</>
					)}
				</div>
				<div
					className={`bg-slate-700 ${
						mode === null ? "" : "px-7 py-1.5"
					} border-1 border-slate-950`}
				>
					{mode === "View" && (
						// TODO: Refactor Code here
						<div className="flex justify-between">
							<div className="flex gap-4">
								{pageMode === "Trash" ? null : (
									<button
										className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-200 font-medium py-3.5 px-5 rounded cursor-pointer shadow-2xl transition-all"
										title="Edit"
										onClick={handleEditItem}
									>
										<MdModeEdit className="text-blue-400 text-xl" />
									</button>
								)}
								{pageMode === "Trash" && (
									<button
										className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-200 font-medium py-3.5 px-5 rounded cursor-pointer shadow-2xl transition-all"
										title="Restore"
										onClick={handleRestore}
									>
										<TbRestore className="text-blue-400 text-xl" />
									</button>
								)}

								<button
									className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-200 font-medium py-3.5 px-5 rounded cursor-pointer shadow-2xl transition-all"
									title="Close"
									onClick={handleClose}
								>
									<MdCloseFullscreen className="text-blue-400 text-xl" />
								</button>
							</div>

							<button
								className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-200 font-medium py-3.5 px-5 rounded cursor-pointer shadow-2xl transition-all"
								title="Delete"
								onClick={handleDeleteItem}
							>
								<HiOutlineTrash className="text-red-600 hover-red-700 text-xl font-extrabold" />
							</button>
						</div>
					)}
					{mode === "Edit" && (
						<div className="flex justify-between">
							<div className="flex gap-4">
								<button
									className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 font-medium text-blue-400 py-3.5 px-5 rounded cursor-pointer shadow-2xl transition-all "
									title="Save"
									onClick={handleSaveItem}
								>
									<LuSave className="text-blue-400 text-xl" />
								</button>
								<button
									className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-200 font-medium py-3.5 px-5 rounded cursor-pointer shadow-2xl transition-all"
									title="Cancel"
									onClick={handleCancel}
								>
									<IoClose className="text-blue-400 text-xl" />
								</button>
							</div>

							<button
								className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-200 font-medium py-3.5 px-5 rounded cursor-pointer shadow-2xl transition-all"
								title="Delete"
								onClick={handleDeleteItem}
							>
								<HiOutlineTrash className="text-red-600 hover-red-700 text-xl" />
							</button>
						</div>
					)}
					{mode === "Add" && (
						<div className="flex gap-4">
							<button
								className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-200 font-medium py-3.5 px-5 rounded cursor-pointer shadow-2xl transition-all"
								title="Save"
								onClick={handleSaveItem}
							>
								<LuSave className="text-blue-400 text-xl" />
							</button>
							<button
								className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-200 font-medium py-3.5 px-5 rounded cursor-pointer shadow-2xl transition-all"
								title="Cancel"
								onClick={handleCancel}
							>
								<IoClose className="text-blue-400 text-xl" />
							</button>
						</div>
					)}
				</div>
			</section>
		</main>
	);
};
