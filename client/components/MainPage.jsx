/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { usePrivateInstance } from "../hooks/usePrivateInstance";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { HiOutlineTrash } from "react-icons/hi2";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TbRestore } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { LuSave } from "react-icons/lu";
import { MdCloseFullscreen } from "react-icons/md";
import { useCrypto } from "../hooks/useCrypto";
import { SearchField } from "./SearchField";
import { Button } from "./Button";
import { SideNav } from "./SideNav";
import { DisplayList } from "./DisplayList";
import { AddItemBtn } from "./AddItemBtn";
import { BgBrand } from "./BgBrand";
import { ItemField } from "./ItemField";
import { ErrorModal } from "./ErrorModal";
import { useDB } from "../hooks/useDB";

export const MainPage = () => {
	const defaultEmpty = {
		id: undefined,
		name: "",
		custom_user: "",
		custom_passwd: "",
		uri: [""],
		note: "",
		favourite: false,
		trash: false,
	};

	// fetch data from the server and save it to the server only then save the to local too
	// const [passwdList, setPasswdList] = useState([]); //
	const { handleAddItem: handleSaveItemDB } = useDB();
	const [itemIndex, setItemIndex] = useState(null); // index for add, edit and view
	const [focusItem, setFocusItem] = useState(defaultEmpty); // passwd item for edit and add mode
	const [mode, setMode] = useState(null); // modes for different view selection (null, view, edit, add)
	const [searchItem, setSearchItem] = useState("");
	const [pageMode, setPageMode] = useState("All");
	// all, fav, trash
	// Errors
	const [pageError, setPageError] = useState("");
	const nameRef = useRef();
	const searchRef = useRef();
	const areaRef = useRef();
	const navigate = useNavigate();
	const { auth, setAuth, passwdList, setPasswdList } = useAuth();
	const { clearSessionKey, handleEncrypt } = useCrypto();
	const privateInstance = usePrivateInstance();

	useEffect(() => {
		searchRef.current?.focus();
	}, []);
	useEffect(() => {
		if ((mode === "Add" || mode === "Edit") && nameRef.current) {
			nameRef.current?.focus();
		}
	}, [mode]);
	// Determine text area size based upon content
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
	// Fetch user data and decrypts it
	useLayoutEffect(() => {
		if (!auth.masterKey) {
			console.log("MainPage: Master Key not available, redirecting to /locked");
			navigate("/locked", { replace: true });
			return;
		}
	}, [auth.masterKey]);
	// Search & filters data based upon user search query & active page
	const filteredList = passwdList.filter((item) => {
		console.log("item: ", item);

		const matchesSearch =
			item?.name?.toLowerCase().includes(searchItem?.toLowerCase()) ||
			item?.user?.toLowerCase().includes(searchItem?.toLowerCase());

		const matchesMode =
			(pageMode === "All" && item.trash === false) || // Only show if not in trash for "View"
			(pageMode === "Fav" && item.favourite === true && item.trash === false) ||
			(pageMode === "Trash" && item.trash === true);

		return matchesSearch && matchesMode;
	});

	// const handlePassReveal = () => {
	// 	setPassReveal((prev) => !prev);
	// };
	// Copy the desired field into os clipboard
	const handleCopy = async (field) => {
		try {
			await navigator.clipboard.writeText(passwdList[itemIndex][field]);
		} catch (error) {
			console.error("Error Copying: ", error);
			setPageError("Copying Item Field Failed");
		}
	};
	// Opens the URI link in the browser
	const handleLinkOpen = (i) => {
		try {
			let url = passwdList[itemIndex].uri[i];
			url = "http://" + url;
			window.open(url, "_blank", "noopener noreferrer");
		} catch (error) {
			console.error("Error Link Opening: ", error);
			setPageError("Opening Link Failed");
		}
	};
	// Copy the URI into the clipboard
	const handleURICopy = async (i) => {
		try {
			await navigator.clipboard.writeText(passwdList[itemIndex].uri[i]);
		} catch (error) {
			console.error("Error Copying: ", error);
			setPageError("Copying Item URI Failed");
		}
	};
	// Removes the URI link
	const handleURIRemove = (i) => {
		setFocusItem((prev) => {
			let uriList = prev.uri;
			const updateURIList = uriList.filter((_, index) => i !== index);
			return { ...prev, uri: updateURIList };
		});
	};
	// opens the view to add new item
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
	// takes user input for different fields
	const handleInputChange = (e) => {
		if (mode === "Edit" || mode === "Add") {
			const { name, value } = e.target;
			setFocusItem((prev) => ({ ...prev, [name]: value }));
		}
	};
	// Adds new empty URI entry in view
	const handleNewURI = () => {
		if (mode === "Edit" || mode === "Add") {
			setFocusItem((prev) => {
				const newURIs = [...prev.uri];
				newURIs.push("");
				return { ...prev, uri: newURIs };
			});
		}
	};
	// mark fav when clicking the whole component
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
	// mark fav when clicking on the checkbox itself
	const handleFavouriteCheckbox = () => {
		if (mode === "Edit" || mode === "Add") {
			setFocusItem((prev) => ({ ...prev, favourite: !prev.favourite }));
		}
	};
	// open the edit view with copy of the current item in the FocusItem state for edit
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
	// for page all & fav it sends them to trash by marking them so they can be restored, but for trash page it removes them completly & cannot ve recovered...also sends request to server to del it in the cloud too
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
				setPageError("Failed Trash Operation");
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
				setPageError("Failed to Remove");
			}
		}

		setMode(null);
	};
	// it removes all the items in the trash both locally & on the cloud & this action is non-recoverable
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
			setPageError("Emptying Trash Failed");
		}

		setMode(null);
		setItemIndex(null);
	};
	// it restores the items in the trash & can be done one item at a time
	const handleRestore = async () => {
		const itemID = passwdList[itemIndex].id;
		try {
			const response = await privateInstance.patch(`/api/v1/item/${itemID}`, {
				trash: false,
			});
			if (response.status === 200 && response.data.success) {
				setPasswdList((prev) => {
					const updatedList = [...prev];
					const item = updatedList[itemIndex];
					const updatedItem = { ...item, trash: false };
					updatedList[itemIndex] = updatedItem;
					return updatedList;
				});
			}
		} catch (error) {
			console.error(
				"Restore Failed: ",
				error,
				error?.response?.data?.msg || "Unknown Error!!!"
			);
			setPageError("Restoring Item Failed");
		}
	};
	// cancel any item being edited or added
	const handleCancel = () => {
		if (mode === "Edit") {
			setFocusItem(defaultEmpty);
			setMode("View");
		} else if (mode === "Add") {
			setFocusItem(defaultEmpty);
			setMode(null);
		}
	};
	// revert the view page to the brand(null page) logo
	const handleClose = () => {
		setItemIndex(null);
		setFocusItem(defaultEmpty);
		setMode(null);
	};
	// data is checked, then encrypted to be sent to the cloud and then save in the local
	const handleSaveItem = async () => {
		// TODO: Add created and updated time
		if (focusItem.name === "") {
			console.error("Name field cannot be empty!!!");
			setPageError("Name Field is Required");
			return;
		}
		if (mode === "Edit") {
			try {
				const itemID = passwdList[itemIndex].id;
				// Apply Encryption to data
				const uriString = JSON.stringify(focusItem.uri);
				const encryptedFocusItem = {
					id: focusItem.id,
					name: JSON.stringify(await handleEncrypt(focusItem.name)),
					user: JSON.stringify(await handleEncrypt(focusItem.user)),
					passwd: JSON.stringify(await handleEncrypt(focusItem.passwd)),
					uri: JSON.stringify(await handleEncrypt(uriString)),
					note: JSON.stringify(await handleEncrypt(focusItem.note)),
					favourite: JSON.stringify(await handleEncrypt(focusItem.favourite)),
					trash: focusItem.trash,
				};
				console.log("Encrypted Data to upload: ", encryptedFocusItem);

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
					setPageError("Uploading Data Failed");
				}
			} catch (error) {
				console.error("Error Decrypting: ", error);
				setPageError("Decryption Failed");
			}
		} else if (mode === "Add") {
			const itemID = uuidv4();
			// Encrypt Data
			const uriString = JSON.stringify(focusItem.uri);
			console.log("Now Adding Item into DB");

			try {
				const dbOp = await handleSaveItemDB({ itemID, ...focusItem });
				console.log("DB Operation: ", dbOp);
			} catch (error) {
				console.error(error);
			}

			const encryptedFocusItem = {
				id: itemID,
				name: JSON.stringify(await handleEncrypt(focusItem.name)),
				user: JSON.stringify(await handleEncrypt(focusItem.user)),
				passwd: JSON.stringify(await handleEncrypt(focusItem.passwd)),
				uri: JSON.stringify(await handleEncrypt(uriString)),
				note: JSON.stringify(await handleEncrypt(focusItem.note)),
				favourite: JSON.stringify(await handleEncrypt(focusItem.favourite)),
				trash: focusItem.trash,
			};
			const item = { ...focusItem, id: itemID };
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
				setPageError("Adding Item Failed");
			}
		}
	};
	// retreive the index of the item clicked and open its view mode that retrieve data of the item using the index we get from the item clicked
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
				setItemIndex(null);
				return null; // click again to close the view from
			}
		});
	};
	// del the user auth status and the data with it
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
			setItemIndex(null);
			setFocusItem(defaultEmpty);
			setSearchItem("");
			setPasswdList([]);
			setMode(null);
			setPageMode("All");
			localStorage.setItem("isLogged", JSON.stringify(false));
			setAuth(null);
			clearSessionKey();
			navigate("/login/email");
		} else {
			console.error("Error: Logging Out");
			setPageError("Failed to Logout");
		}
	};
	// Clears the search field entry
	const handleSearchClear = () => {
		setSearchItem("");
		searchRef.current?.focus();
	};

	const handleCloseErrorModal = () => {
		setPageError("");
	};

	return (
		// <main className="grid grid-cols-3 grid-rows-[auto_1fr] h-full">
		<main className="grid grid-cols-[10rem_24rem_1fr] grid-rows-[auto_1fr] h-full select-none">
			<ErrorModal
				message={pageError}
				onClose={handleCloseErrorModal}
				isOpen={pageError}
			/>
			<section className="col-start-1 col-end-4 row-start-1 row-end-2 grid grid-cols-[1fr_10rem] justify-items-center p-2 border border-l-0 border-slate-950">
				{/* Search Bar */}
				<SearchField
					searchItem={searchItem}
					onChange={(e) => setSearchItem(e.target.value)}
					pageMode={pageMode}
					ref={searchRef}
					onClick={handleSearchClear}
					Icon={IoMdCloseCircleOutline}
				/>
				{/* Logout Button */}
				<Button onClick={handleLogout} variant="danger">
					Logout
				</Button>
			</section>

			<section className="col-start-1 col-end-2 row-start-2 row-end-3 content-center border-r border-slate-950 pl-3">
				<SideNav
					pageMode={pageMode}
					pageModeText="All"
					setPageMode={setPageMode}
				/>
			</section>

			<section className="col-start-2 col-end-3 row-start-2 row-end-3 flex flex-col justify-between min-h-0 ">
				{/* min-h-0 for flex and grid to bend them to the will of overflow */}
				{/* Display all passwd list here */}
				<div className="overflow-y-scroll h-full">
					{/* {passwdList.length !== 0 ? ( */}
					<DisplayList
						filteredList={filteredList}
						passwdList={passwdList}
						itemIndex={itemIndex}
						handleClickItem={handleClickItem}
					/>
				</div>
				<div className="self-center w-full px-5 py-1.5 bg-slate-700 border-1 border-slate-950">
					<AddItemBtn
						pageMode={pageMode}
						handleAddItem={handleAddItem}
						handleEmptyTrash={handleEmptyTrash}
					/>
				</div>
			</section>

			<section
				className={`col-start-3 col-end-4 row-start-2 row-end-3 ${
					mode === null ? "" : "bg-slate-900"
				} h-full min-h-0 flex flex-col justify-between border-1 border-slate-950`}
			>
				{/* Background Brand Image */}
				{mode === null && <BgBrand />}
				<div className="px-7 overflow-y-auto pb-2">
					{/* Display view of passwd and edition of them here */}
					{(mode === "View" || mode === "Edit" || mode === "Add") && (
						<>
							<div className="text-slate-300 mb-1 mt-4">
								{mode === "View" ? (
									<h3>ITEM INFORMATION</h3>
								) : mode === "Edit" ? (
									<h3>EDIT ITEM</h3>
								) : mode === "Add" ? (
									<h3>ADD ITEM</h3>
								) : null}
							</div>

							<div className="bg-slate-700 flex flex-col">
								{(mode === "View" && passwdList[itemIndex]?.name) ||
								mode === "Add" ||
								mode === "Edit" ? (
									<div className="flex border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5 justify-start w-full">
										<ItemField
											label="Name"
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
											required={true}
											mode={mode}
										/>
									</div>
								) : (
									""
								)}
								{(mode === "View" && passwdList[itemIndex]?.user) ||
								mode === "Add" ||
								mode === "Edit" ? (
									<div className="flex border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5 justify-start items-center w-full">
										<ItemField
											label="Username"
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
											mode={mode}
											cTitle="Copy Username"
											onClick={() => handleCopy("user")}
											showCopy={true}
										/>
									</div>
								) : (
									""
								)}
								{(mode === "View" && passwdList[itemIndex]?.passwd) ||
								mode === "Add" ||
								mode === "Edit" ? (
									<div className="flex items-center justify-between border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5">
										<ItemField
											label="Password"
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
											autoComplete="off"
											mode={mode}
											cTitle="Copy Password"
											tTitle="Toggle Visibility"
											onClick={() => handleCopy("passwd")}
											showCopy={true}
											showToggle={true}
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
												className="flex items-center justify-between border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5"
												key={`uri-${i}`}
											>
												<ItemField
													label={`URI ${i + 1}`}
													type="text"
													name={`uri-${i}`}
													id={`uri-${i}`}
													value={item || ""}
													onChange={handleInputChange}
													readOnly={mode === "View"}
													autoComplete="off"
													mode={mode}
													onLinkClick={() => handleLinkOpen(i)}
													onURICopyClick={() => handleURICopy(i)}
													showCopyLink={true}
													showLinkOpen={true}
												/>
											</div>
										);
									})}
								{/* Add mode URI List and Edit mode */}
								{focusItem.uri.length !== 0 &&
								(mode === "Edit" || mode === "Add")
									? focusItem.uri.map((item, i) => (
											<div className="flex items-center justify-between border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5">
												<ItemField
													label={`URI ${i + 1}`}
													type="text"
													name={`uri-${i}`}
													id={`uri-${i}`}
													value={item || ""}
													onChange={(e) => {
														setFocusItem((prev) => {
															const newURIs = [...prev.uri];
															newURIs[i] = e.target.value;
															return { ...prev, uri: newURIs };
														});
													}}
													readOnly={mode === "View"}
													autoComplete="off"
													mode={mode}
													onLinkDel={() => handleURIRemove(i)}
													showDel={true}
												/>
											</div>
									  ))
									: null}
								{mode === "Add" || mode === "Edit" ? (
									<Button
										Icon={IoMdAddCircleOutline}
										onClick={handleNewURI}
										variant="newURI"
									>
										New URI
									</Button>
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
											mode === "View" ? "focus:outline-none" : "cursor-text"
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
										} cursor-text w-full bg-slate-700 p-2`}
									></textarea>
								</div>
							) : null}
							{/* Favourite Btn Here */}
							{mode === "Add" ||
							mode === "Edit" ||
							(mode === "View" && passwdList[itemIndex]?.favourite) ? (
								// Favourite Button for Item
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
						<div className="flex justify-between">
							<div className="flex gap-4">
								{passwdList[itemIndex].trash === true ? null : (
									<Button
										Icon={MdModeEdit}
										variant="diffOps"
										title="Edit"
										onClick={handleEditItem}
									></Button>
								)}
								{passwdList[itemIndex].trash === true && (
									<Button
										Icon={TbRestore}
										variant="diffOps"
										title="Restore"
										onClick={handleRestore}
									></Button>
								)}
								<Button
									Icon={MdCloseFullscreen}
									variant="diffOps"
									title="Close"
									onClick={handleClose}
								></Button>
							</div>
							<Button
								Icon={HiOutlineTrash}
								IconStyle="text-red-600 hover:text-red-700"
								variant="diffOps"
								title="Delete"
								onClick={handleDeleteItem}
							></Button>
						</div>
					)}
					{mode === "Edit" && (
						<div className="flex justify-between">
							<div className="flex gap-4">
								<Button
									Icon={LuSave}
									variant="diffOps"
									title="Save"
									onClick={handleSaveItem}
								></Button>
								<Button
									Icon={IoClose}
									variant="diffOps"
									title="Cancel"
									onClick={handleCancel}
								></Button>
							</div>
							<Button
								Icon={HiOutlineTrash}
								IconStyle="text-red-600 hover:text-red-700"
								variant="diffOps"
								title="Delete"
								onClick={handleDeleteItem}
							></Button>
						</div>
					)}
					{mode === "Add" && (
						<div className="flex gap-4">
							<Button
								Icon={LuSave}
								variant="diffOps"
								title="Save"
								onClick={handleSaveItem}
							></Button>
							<Button
								Icon={IoClose}
								variant="diffOps"
								title="Cancel"
								onClick={handleCancel}
							></Button>
						</div>
					)}
				</div>
			</section>
		</main>
	);
};
