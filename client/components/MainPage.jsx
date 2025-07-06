/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { usePrivateInstance } from "../hooks/usePrivateInstance";
import KeyRingIcon from "../public/keyring.svg?react";
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
import { GiRoundStar } from "react-icons/gi";
import { BiSolidCopy } from "react-icons/bi";
import { PiEyeDuotone } from "react-icons/pi";
import { PiEyeSlash } from "react-icons/pi";
import { MdOutlineLaunch } from "react-icons/md";
import { FiMinusCircle } from "react-icons/fi";
import { useCrypto } from "../hooks/useCrypto";

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
	const [passReveal, setPassReveal] = useState(false);
	const [mode, setMode] = useState(null); // modes for different view selection (null, view, edit, add)
	const [searchItem, setSearchItem] = useState("");
	const [pageMode, setPageMode] = useState("All");
	// all, fav, trash
	const nameRef = useRef();
	const searchRef = useRef();
	const areaRef = useRef();
	const navigate = useNavigate();
	const { setAuth } = useAuth();
	const { clearSessionKey, handleEncrypt, handleDecrypt } = useCrypto();
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
						// Decrypt Data upon arrival
						return {
							id: itemID,
							name: handleDecrypt(JSON.parse(name)),
							user: handleDecrypt(JSON.parse(user)),
							passwd: handleDecrypt(JSON.parse(passwd)),
							uri: handleDecrypt(JSON.parse(uri)),
							note: handleDecrypt(JSON.parse(note)),
							favourite: JSON.parse(handleDecrypt(JSON.parse(fav))),
							trash: handleDecrypt(JSON.parse(trash)),
						};
					});
					setPasswdList(updatedList);
				}
			} catch (error) {
				console.error(error.response.data.msg);
			}
		};
		getAllItems();
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

	const handlePassReveal = () => {
		setPassReveal((prev) => !prev);
	};

	const handleCopy = async (field) => {
		try {
			await navigator.clipboard.writeText(passwdList[itemIndex][field]);
		} catch (error) {
			console.error("Error Copying: ", error);
		}
	};

	const handleLinkOpen = (i) => {
		try {
			let url = passwdList[itemIndex].uri[i];
			url = "http://" + url;
			window.open(url, "_blank", "noopener noreferrer");
		} catch (error) {
			console.error("Error Link Opening: ", error);
		}
	};

	const handleURICopy = async (i) => {
		try {
			await navigator.clipboard.writeText(passwdList[itemIndex].uri[i]);
		} catch (error) {
			console.error("Error Copying: ", error);
		}
	};

	const handleURIRemove = (i) => {
		setFocusItem((prev) => {
			let uriList = prev.uri;
			const updateURIList = uriList.filter((_, index) => i !== index);
			return { ...prev, uri: updateURIList };
		});
	};

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
					trash: JSON.stringify(handleEncrypt(!passwdList[itemIndex].trash)),
					// trash: !passwdList[itemIndex].trash,
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
		if (focusItem.name === "") {
			console.error("Name field cannot be empty!!!");
			return;
		}
		if (mode === "Edit") {
			const itemID = passwdList[itemIndex].id;
			// Apply Encryption to data
			const uriString = JSON.stringify(focusItem.uri);
			const encryptedFocusItem = {
				id: focusItem.id,
				name: JSON.stringify(handleEncrypt(focusItem.name)),
				user: JSON.stringify(handleEncrypt(focusItem.user)),
				passwd: JSON.stringify(handleEncrypt(focusItem.passwd)),
				uri: JSON.stringify(handleEncrypt(uriString)),
				note: JSON.stringify(handleEncrypt(focusItem.note)),
				favourite: JSON.stringify(handleEncrypt(focusItem.favourite)),
				trash: JSON.stringify(handleEncrypt(focusItem.trash)),
			};
			try {
				const response = await privateInstance.put(
					`/api/v1/item/${itemID}`,
					encryptedFocusItem
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
			// Encrypt Data
			const uriString = JSON.stringify(focusItem.uri);
			const encryptedFocusItem = {
				id: itemID,
				name: JSON.stringify(handleEncrypt(focusItem.name)),
				user: JSON.stringify(handleEncrypt(focusItem.user)),
				passwd: JSON.stringify(handleEncrypt(focusItem.passwd)),
				uri: JSON.stringify(handleEncrypt(uriString)),
				note: JSON.stringify(handleEncrypt(focusItem.note)),
				favourite: JSON.stringify(handleEncrypt(focusItem.favourite)),
				trash: JSON.stringify(handleEncrypt(focusItem.trash)),
			};
			const item = { ...focusItem, id: itemID };
			console.log("item: ", encryptedFocusItem);
			try {
				const response = await privateInstance.post(
					`/api/v1/item/${itemID}`,
					encryptedFocusItem
					// item
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
			clearSessionKey();
		}
	};

	const handleSearchClear = () => {
		setSearchItem("");
		searchRef.current?.focus();
	};

	return (
		// <main className="grid grid-cols-3 grid-rows-[auto_1fr] h-full">
		<main className="grid grid-cols-[10rem_24rem_1fr] grid-rows-[auto_1fr] h-full select-none">
			<section className="col-start-1 col-end-4 row-start-1 row-end-2 grid grid-cols-[1fr_10rem] justify-items-center p-2 border border-l-0 border-slate-950">
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
					className="bg-red-800 hover:bg-red-700 text-slate-200 font-medium py-2.5 px-4 rounded  cursor-pointer shadow-md border-1 border-slate-600 hover:border-slate-400 transition-all"
				>
					Logout
				</button>
			</section>

			<section className="col-start-1 col-end-2 row-start-2 row-end-3 content-center border-r border-slate-950 pl-3">
				<ul className="flex flex-col gap-y-1.5 relative bottom-[10%] text-lg">
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

			<section className="col-start-2 col-end-3 row-start-2 row-end-3 flex flex-col justify-between min-h-0 ">
				{/* min-h-0 for flex and grid to bend them to will of overflow */}
				{/* Display all passwd list here */}
				<div className="overflow-y-scroll h-full">
					{/* {passwdList.length !== 0 ? ( */}
					{filteredList.length !== 0 ? (
						<ul className="flex flex-col">
							{filteredList.map((item) => (
								<li
									className={`hover:bg-slate-700 pl-2 py-2 flex items-center pr-3 justify-between gap-x-1 border-l-4  active:border-l-slate-400 cursor-pointer truncate ${
										item.id === passwdList[itemIndex]?.id && itemIndex !== null
											? "border-l-blue-400 bg-slate-700"
											: "border-l-transparent"
									}`}
									key={item.id}
									onClick={() => handleClickItem(item.id)}
								>
									<div className="flex items-center gap-2">
										<span className="w-10 h-10 bg-slate-500 rounded-full flex justify-center items-center font-medium text-slate-200 shrink-0 text-xl">
											{item.name.charAt(0).toUpperCase()}
										</span>
										<div>
											<p>
												{item.name.length > 40
													? item.name.slice(0, 37) + "..."
													: item.name}
											</p>
											<p>{item.user}</p>
										</div>
									</div>
									{item.favourite && (
										<GiRoundStar className="text-yellow-300" />
									)}
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
							className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 flex justify-center font-medium py-2 w-full rounded shadow-2xl cursor-pointer  transition-colors"
							onClick={handleAddItem}
							title="Add Item"
						>
							<MdOutlineAdd className="text-blue-400 text-xl" size={32} />
						</button>
					) : (
						<button
							className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 flex justify-center font-medium py-3.5 w-full rounded shadow-2xl cursor-pointer  transition-colors text-sm"
							onClick={handleEmptyTrash}
							title="Add Item"
						>
							Empty Trash
						</button>
					)}
				</div>
			</section>

			<section
				className={`col-start-3 col-end-4 row-start-2 row-end-3 ${
					mode === null ? "" : "bg-slate-900"
				} h-full min-h-0 flex flex-col justify-between border-1 border-slate-950`}
			>
				{mode === null && (
					<div className="text-slate-400 flex gap-x-2 justify-center h-full items-center relative bottom-[7%]">
						<KeyRingIcon className="w-17 h-17" />
						<span className="font-thin text-5xl">
							<span className="font-bold">key</span>Ring
						</span>
					</div>
				)}
				<div className="px-7 overflow-y-auto">
					{/* Display view of passwd and edition of them here */}
					{(mode === "View" || mode === "Edit" || mode === "Add") && (
						<>
							<p className="text-slate-300 mb-1 mt-4">
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
											autoComplete="off"
											required
											className={`${
												mode === "View" ? "focus:outline-none" : "outline-none"
											} cursor-default text-[1.2rem]`}
										/>
									</div>
								) : (
									""
								)}
								{(mode === "View" && passwdList[itemIndex]?.user) ||
								mode === "Add" ||
								mode === "Edit" ? (
									<div className="flex items-center justify-between border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5">
										<div className="flex flex-col grow">
											<label className="text-slate-300 text-sm" htmlFor="user">
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
												autoComplete="off"
												className={`${
													mode === "View"
														? "focus:outline-none"
														: "outline-none"
												} cursor-default text-[1.2rem]`}
											/>
										</div>
										<div>
											{mode === "View" && (
												<BiSolidCopy
													className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
													title="Copy Username"
													onClick={() => handleCopy("user")}
												/>
											)}
										</div>
									</div>
								) : (
									""
								)}
								{(mode === "View" && passwdList[itemIndex]?.passwd) ||
								mode === "Add" ||
								mode === "Edit" ? (
									<div className="flex items-center justify-between border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5">
										<div className="flex flex-col grow">
											<label
												className="text-slate-300 text-sm"
												htmlFor="passwd"
											>
												Password
											</label>
											<input
												// type="password"
												type={passReveal ? "text" : "password"}
												name="passwd"
												id="passwd"
												value={
													mode === "View"
														? passwdList[itemIndex].passwd || ""
														: focusItem.passwd || ""
												}
												onChange={handleInputChange}
												readOnly={mode === "View"}
												autoComplete="off"
												className={`${
													mode === "View"
														? "focus:outline-none"
														: "outline-none"
												} cursor-default text-[1.2rem]`}
											/>
										</div>
										<div className="flex gap-3">
											{passReveal ? (
												<PiEyeSlash
													className="text-2xl cursor-pointer opacity-70  duration-200"
													title="Toggle Visibility"
													onClick={handlePassReveal}
												/>
											) : (
												<PiEyeDuotone
													className="text-2xl cursor-pointer opacity-70 duration-200"
													title="Toggle Visibility"
													onClick={handlePassReveal}
													onmou
												/>
											)}

											{mode === "View" && (
												<BiSolidCopy
													className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
													title="Copy Password"
													onClick={() => handleCopy("passwd")}
												/>
											)}
										</div>
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
												className="flex items-center justify-between border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5"
												key={`uri-${i}`}
											>
												<div className="flex flex-col">
													<label
														className="text-slate-300 text-sm"
														htmlFor={`uri-${i}`}
													>{`URI ${i + 1}`}</label>
													<input
														type="text"
														name={`uri-${i}`}
														id={`uri-${i}`}
														value={item || ""}
														readOnly
														autoComplete="off"
														className={`${
															mode === "View"
																? "focus:outline-none"
																: "outline-none"
														} cursor-default text-[1.2rem]`}
													/>
												</div>
												<div className="flex gap-3">
													<MdOutlineLaunch
														className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
														title="Open Link"
														onClick={() => handleLinkOpen(i)}
													/>

													<BiSolidCopy
														className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
														title="Copy Link"
														onClick={() => handleURICopy(i)}
													/>
												</div>
											</div>
										);
									})}
								{/* Add mode URI List and Edit mode */}
								{focusItem.uri.length !== 0 &&
								(mode === "Edit" || mode === "Add")
									? focusItem.uri.map((item, i) => (
											<div className="flex items-center border-b-1 border-slate-500 hover:bg-slate-600 last:border-b-0">
												<div className="px-3.5">
													<FiMinusCircle
														title="Remove"
														className="text-2xl text-red-500 cursor-pointer"
														onClick={() => handleURIRemove(i)}
													/>
												</div>
												<div
													className="flex flex-col   py-3 grow"
													key={`uri-${i}`}
												>
													<label
														className="text-slate-300 text-sm"
														htmlFor={`edit-uri-${i}`}
													>{`URI ${i + 1}`}</label>
													<input
														type="text"
														name={`edit-uri-${i}`}
														id={`edit-uri-${i}`}
														value={item || ""}
														autoComplete="off"
														onChange={(e) => {
															setFocusItem((prev) => {
																const newURIs = [...prev.uri];
																newURIs[i] = e.target.value;
																return { ...prev, uri: newURIs };
															});
														}}
														className="outline-none text-[1.2rem]"
													/>
												</div>
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
									<h3 className="text-slate-300 my-1">NOTES</h3>
									<textarea
										name="item-notes"
										id="item-notes"
										value={passwdList[itemIndex]?.note || ""}
										readOnly
										ref={areaRef}
										autoComplete="off"
										autoCapitalize="off"
										autoCorrect="off"
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
