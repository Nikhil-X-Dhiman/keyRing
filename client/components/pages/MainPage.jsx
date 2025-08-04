/* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useLayoutEffect, useRef, useState } from "react";
// // import { v4 as uuidv4 } from "uuid";
// import { useNavigate } from "react-router";
// import { useAuth } from "../../hooks/useAuth";
// import { usePrivateInstance } from "../../hooks/usePrivateInstance";
// import { useCrypto } from "../../hooks/useCrypto";
import { SearchField } from "../SearchField";
import { Button } from "../Button";
import { SideNav } from "../SideNav";
import { DisplayList } from "../DisplayList";
import { AddItemBtn } from "../AddItemBtn";
import { BgBrand } from "../BgBrand";
import { ItemField } from "../ItemField";
// import { useDB } from "../../hooks/useDB";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDB } from "../../hooks/useDB";
import { Navigate, replace, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useCrypto } from "../../hooks/useCrypto";
import { usePrivateInstance } from "../../hooks/usePrivateInstance";
import { ErrorModal } from "../ErrorModal";

import { IoMdCloseCircleOutline } from "react-icons/io";
import { HiOutlineTrash } from "react-icons/hi2";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TbRestore } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { LuSave } from "react-icons/lu";
import { MdCloseFullscreen } from "react-icons/md";
import { useAccount } from "../../hooks/useAccount";
import { useFetchData } from "../../hooks/useFetchData";
import { useStorage } from "../../hooks/useStorage";
import DropDownBtn from "../DropDownBtn";

const MainPage = () => {
	const defaultEmpty = {
		uuid: undefined,
		name: "",
		username: "",
		password: "",
		uri: [""],
		note: "",
		favourite: false,
		trash: false,
	};

	// fetch data from the server and save it to the server only then save the to local too
	// const [passwordList, setPasswordList] = useState([]); //
	const {
		handleAddItemDB,
		handleEditItemDB,
		handleToggleTrashDB,
		handleToggleFavDB,
		handleDeleteItemDB,
		handleEmptyTrashDB,
		handleBulkAddItemsDB,
	} = useDB();
	const { logout } = useAccount();
	const { handleFetchList } = useFetchData();
	const { saveToFile, readFromFile: restoreFromFile } = useStorage();

	const [passwordList, setPasswordList] = useState([]);
	const [itemIndex, setItemIndex] = useState(null); // index for add, edit and view
	const [focusItem, setFocusItem] = useState(defaultEmpty); // passwd item for edit and add mode
	const [mode, setMode] = useState(null); // modes for different view selection (null, view, edit, add)
	const [searchItem, setSearchItem] = useState("");
	const [pageMode, setPageMode] = useState("All");
	const [, forceRender] = useState(0);
	// const [, forceRender] = useState(false);
	// all, fav, trash
	// Errors
	const [pageError, setPageError] = useState("");
	const nameRef = useRef();
	const searchRef = useRef();
	const areaRef = useRef();
	const navigate = useNavigate();
	// const location = useLocation();
	const { masterKey, auth } = useAuth();
	const { handleEncrypt, handleListToDecrypt } = useCrypto();
	const privateInstance = usePrivateInstance();

	// const masterKey = useRef("");
	// masterKey.current = location.state?.masterKey;
	// const masterKey = location.state?.masterKey;

	useEffect(() => {
		if (masterKey.current) {
			(async () => {
				const [plainItemList] = await handleFetchList();
				console.log("MainPage -> Password List:", plainItemList);

				setPasswordList(plainItemList);
			})();
		} else {
			console.log(
				"Fetch Data: No MasterKey Found!!! Skipping Fetching new data"
			);
		}
	}, []);

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
	// useLayoutEffect(() => {
	// 	if (!auth?.masterKey || !auth?.user?.email) {
	// 		console.log("MainPage: Master Key not available, redirecting to /locked");
	// 		navigate("/locked", { replace: true });
	// 		return;
	// 	}
	// }, [masterKey.current]);
	// Search & filters data based upon user search query & active page
	const filteredList = passwordList.filter((item) => {
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
			await navigator.clipboard.writeText(passwordList[itemIndex][field]);
		} catch (error) {
			console.error("Error Copying: ", error);
			setPageError("Copying Item Field Failed");
		}
	};
	// Opens the URI link in the browser
	const handleLinkOpen = (i) => {
		try {
			let url = passwordList[itemIndex].uri[i];
			url = "https://" + url;
			window.open(url, "_blank", "noopener noreferrer");
		} catch (error) {
			console.error("Error Link Opening: ", error);
			setPageError("Opening Link Failed");
		}
	};
	// Copy the URI into the clipboard
	const handleURICopy = async (i) => {
		try {
			await navigator.clipboard.writeText(passwordList[itemIndex].uri[i]);
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
	const handleNewURI = async () => {
		if (mode === "Edit" || mode === "Add") {
			setFocusItem((prev) => {
				const newURIs = [...prev.uri];
				newURIs.push("");
				return { ...prev, uri: newURIs };
			});
		}
	};
	// mark fav when clicking the whole component
	const handleFavouriteDiv = async (e) => {
		if (e.target.type === "checkbox") {
			e.stopPropagation();
			console.log("checkbox");
			return;
		}
		if (mode === "Edit" || mode === "Add") {
			// const itemUUID = passwordList[itemIndex].uuid;
			// await handleToggleFavDB(itemUUID, passwordList[itemIndex].favourite);
			setFocusItem((prev) => ({ ...prev, favourite: !prev.favourite }));
		}
	};
	// mark fav when clicking on the checkbox itself
	const handleFavouriteCheckbox = async () => {
		if (mode === "Edit" || mode === "Add") {
			// const itemUUID = passwordList[itemIndex].uuid;
			// await handleToggleFavDB(itemUUID, passwordList[itemIndex].favourite);
			setFocusItem((prev) => ({ ...prev, favourite: !prev.favourite }));
		}
	};
	// open the edit view with copy of the current item in the FocusItem state for edit
	const handleEditItem = () => {
		setFocusItem(passwordList[itemIndex] || "");
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
			const itemUUID = passwordList[itemIndex].uuid;
			console.log("MainPage->Moving to Trash an item: ", itemUUID);

			try {
				const response = await privateInstance.patch(
					`/api/v1/item/${itemUUID}`,
					{
						trash: !passwordList[itemIndex].trash,
					}
				);
				if (response.status === 200 && response.data.success) {
					await handleToggleTrashDB(itemUUID, false);
					setPasswordList((prev) => {
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

			const itemUUID = passwordList[itemIndex].uuid;
			console.log("Delete Item ID: ", itemUUID);

			try {
				const response = await privateInstance.delete(
					`/api/v1/item/${itemUUID}`
				);
				console.log(response);

				if (response.status === 200 && response.data.success === true) {
					await handleDeleteItemDB(itemUUID);
					setPasswordList((prev) => {
						console.log("Empty trash list update");

						const updatedpasswordList = prev.filter((_, i) => {
							return i !== itemIndex;
						});
						return updatedpasswordList;
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
				await handleEmptyTrashDB();
				setPasswordList((prev) => {
					let updatedList = [...prev];
					updatedList = passwordList.filter((item) => {
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
		const itemUUID = passwordList[itemIndex].uuid;
		try {
			const response = await privateInstance.patch(`/api/v1/item/${itemUUID}`, {
				trash: false,
			});
			if (response.status === 200 && response.data.success) {
				await handleToggleTrashDB(itemUUID, true);
				setPasswordList((prev) => {
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
				const itemUUID = passwordList[itemIndex].uuid;
				// Apply Encryption to data
				const uriString = JSON.stringify(focusItem.uri);
				const encryptedFocusItem = {
					uuid: focusItem.uuid,
					name: await handleEncrypt(focusItem.name),
					username: await handleEncrypt(focusItem.username),
					password: await handleEncrypt(focusItem.password),
					uri: await handleEncrypt(uriString),
					note: await handleEncrypt(focusItem.note),
					favourite: focusItem.favourite,
					trash: focusItem.trash,
					createdAt: focusItem.createdAt,
					updatedAt: new Date().toUTCString(),
				};
				console.log("Encrypted Data to upload: ", encryptedFocusItem);

				try {
					const response = await privateInstance.put(
						`/api/v1/item/${itemUUID}`,
						encryptedFocusItem
					);
					if (response.status === 200 && response.data.success === true) {
						await handleEditItemDB(encryptedFocusItem);
						setPasswordList((prev) => {
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
			const itemUUID = crypto.randomUUID();
			// Encrypt Data
			const uriString = JSON.stringify(focusItem.uri);
			console.log("Now Adding Item into DB");

			const encryptedFocusItem = {
				uuid: itemUUID,
				name: await handleEncrypt(focusItem.name),
				username: await handleEncrypt(focusItem.username),
				password: await handleEncrypt(focusItem.password),
				uri: await handleEncrypt(uriString),
				note: await handleEncrypt(focusItem.note),
				favourite: focusItem.favourite,
				trash: focusItem.trash,
				createAt: new Date().toUTCString(),
				updatedAt: new Date().toUTCString(),
			};
			const item = { ...focusItem, uuid: itemUUID };
			try {
				const response = await privateInstance.post(
					`/api/v1/item/${itemUUID}`,
					encryptedFocusItem
					// item
				);
				if (response.status === 201 && response.data.success === true) {
					console.table(encryptedFocusItem);
					try {
						const dbOp = await handleAddItemDB(encryptedFocusItem);
						console.log("DB Operation: ", dbOp);
					} catch (error) {
						console.error(error);
					}
					setPasswordList((prev) => {
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
	const handleClickItem = (uuid) => {
		// Display Clicked Passwd View
		console.log("Item UUID: ", uuid);

		let prevItemIndex = itemIndex; // get old clicked item index
		let i = passwordList.findIndex((item) => item.uuid === uuid); // find index uring id
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
		// const response = await privateInstance.get("/api/v1/auth/logout", {
		// 	withCredentials: true,
		// });
		// const success = response?.data?.success;
		// const message = response?.data?.msg;
		// console.log("logout response: ", response);

		// console.log(success, message);

		// if (response.status === 200) {
		// 	console.log("logged out");
		// 	setItemIndex(null);
		// 	setFocusItem(defaultEmpty);
		// 	setSearchItem("");
		// 	setPasswordList([]);
		// 	setMode(null);
		// 	setPageMode("All");
		// 	localStorage.setItem("isLogged", JSON.stringify(false));
		// 	setAuth(null);
		// 	await handleEmptyListDB();
		// 	await handleEmptyAppState();
		// 	await handleDelDB();
		// 	clearSessionKey();
		// 	navigate("/login/email");
		// } else {
		// 	console.error("Error: Logging Out");
		// 	setPageError("Failed to Logout");
		// }
		await logout();
	};
	// Clears the search field entry
	const handleSearchClear = () => {
		setSearchItem("");
		searchRef.current?.focus();
	};

	const handleCloseErrorModal = () => {
		setPageError("");
	};

	const handleLockVault = () => {
		console.log("MainPage > handleLockVault: Vault Locked");

		masterKey.current = "";
		navigate("/locked", { replace: true });
	};

	const handleSync = async () => {
		// debugger;
		console.log("handleSync: Sync Started");
		if (!masterKey.current) {
			handleLockVault();
		}
		setPasswordList([]);
		const [newPasswordList] = await handleFetchList();
		console.log("handleSync: New Password table: ");

		console.table(newPasswordList);

		setPasswordList(newPasswordList);
		console.log("handleSync: Sync Ended");
	};

	const handleExport = async () => {
		console.log("handleExport: Export Started");
		try {
			const [, encryptedData] = await handleFetchList();
			if (!encryptedData) {
				console.error("No Data to store");
				return;
			}
			await saveToFile(encryptedData);
			console.log("handleExport: Export Completed Successfully");
		} catch (error) {
			console.error("handleExport: Error during export process:", error);
		}
	};

	const handleImport = async (event) => {
		try {
			console.log("handleImport: Event: ", event);
			const encryptedFileData = await restoreFromFile(event);
			// Upload data to cloud
			const userID = auth.user.userID;
			const newEncryptedFileData = encryptedFileData.map((item) => ({
				name: item.name,
				username: item.username,
				password: item.password,
				favourite: item.favourite,
				note: item.note,
				trash: item.trash,
				uri: item.uri,
				uuid: item.uuid,
				userID,
			}));
			const response = await privateInstance.post(
				`/api/v1/all`,
				newEncryptedFileData
			);
			if (response.status === 201 && response.data.success === true) {
				console.log("MainPage > handleImport: Cloud Restore is Successfull");
			}
			// Save Data to indexedDB
			console.table(
				"MainPage > Imported Data: ",
				encryptedFileData,
				typeof encryptedFileData,
				Array.isArray(encryptedFileData)
			);
			const success = await handleBulkAddItemsDB(encryptedFileData);
			if (success) {
				console.log("MainPage > handleImport: Bulk Add Success: ");
			} else {
				console.error("MainPage > handleImport: Bulk Add Failed to IndexedDB");
			}

			const decryptedData = await handleListToDecrypt(encryptedFileData);
			setPasswordList(decryptedData);
		} catch (error) {
			console.error("handleImport: Importing Data Failed: ", error);
		}
	};

	console.log("inside main: ", masterKey.current);
	// console.log("inside main: ", location.state.masterKey);
	// if (!masterKey.current) {
	// 	return <Navigate to="/locked" replace />;
	// }
	if (!masterKey.current) {
		console.error("Main: No master key found, redirect to locked");

		return <Navigate to="/locked" replace />;
	}

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
				<div className="flex">
					{/* <Button variant="dropDown">{`>`}</Button> */}
					<DropDownBtn>
						<p className="rotate-90">{">"}</p>
					</DropDownBtn>
					<Button onClick={handleLogout} variant="danger">
						Logout
					</Button>
				</div>
				{/* <Button onClick={handleExport}>Export</Button>
				<label htmlFor="fileImport">Import</label>
				<input
					id="fileImport"
					type="file"
					accept="application/json"
					onChange={handleImport}
					className="hidden"
				/>
				<Button onClick={handleLockVault}>Lock</Button>
				<Button onClick={handleSync}>Sync</Button> */}
			</section>

			<section className="col-start-1 col-end-2 row-start-2 row-end-3 content-center border-r border-slate-950 pl-3">
				<SideNav
					pageMode={pageMode}
					parsedFile
					pageModeText="All"
					setPageMode={setPageMode}
				/>
			</section>

			<section className="col-start-2 col-end-3 row-start-2 row-end-3 flex flex-col justify-between min-h-0 ">
				{/* min-h-0 for flex and grid to bend them to the will of overflow */}
				{/* Display all passwd list here */}
				<div className="overflow-y-scroll h-full">
					{/* {passwordList.length !== 0 ? ( */}
					<DisplayList
						// filteredList={filteredList}
						filteredList={filteredList}
						passwordList={passwordList}
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
								{(mode === "View" && passwordList[itemIndex]?.name) ||
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
													? passwordList[itemIndex]?.name || ""
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
								{(mode === "View" && passwordList[itemIndex]?.username) ||
								mode === "Add" ||
								mode === "Edit" ? (
									<div className="flex border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5 justify-start items-center w-full">
										<ItemField
											label="Username"
											type="text"
											name="username"
											id="username"
											value={
												mode === "View"
													? passwordList[itemIndex].username || ""
													: focusItem.username || ""
											}
											onChange={handleInputChange}
											readOnly={mode === "View"}
											autoComplete="off"
											mode={mode}
											cTitle="Copy Username"
											onClick={() => handleCopy("username")}
											showCopy={true}
										/>
									</div>
								) : (
									""
								)}
								{(mode === "View" && passwordList[itemIndex]?.password) ||
								mode === "Add" ||
								mode === "Edit" ? (
									<div className="flex items-center justify-between border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5">
										<ItemField
											label="Password"
											type="password"
											name="password"
											id="password"
											value={
												mode === "View"
													? passwordList[itemIndex].password || ""
													: focusItem.password || ""
											}
											onChange={handleInputChange}
											readOnly={mode === "View"}
											autoComplete="new-password"
											mode={mode}
											cTitle="Copy Password"
											tTitle="Toggle Visibility"
											onClick={() => handleCopy("password")}
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
								{passwordList.length !== 0 &&
									mode === "View" &&
									itemIndex !== null &&
									passwordList[itemIndex]?.uri.map((item, i) => {
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
											<div
												key={`${i}`}
												className="flex items-center justify-between border-b-1 border-slate-500 last:border-b-0 hover:bg-slate-600 py-3 px-3.5"
											>
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
							{mode === "View" && passwordList[itemIndex]?.note ? (
								<div>
									<h3 className="text-slate-300 my-1">NOTES</h3>
									<textarea
										name="item-notes"
										id="item-notes"
										value={passwordList[itemIndex]?.note || ""}
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
							(mode === "View" && passwordList[itemIndex]?.favourite) ? (
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
												? passwordList[itemIndex]?.favourite || false
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
								{passwordList[itemIndex]?.trash === true ? null : (
									<Button
										Icon={MdModeEdit}
										variant="diffOps"
										title="Edit"
										onClick={handleEditItem}
									></Button>
								)}
								{passwordList[itemIndex]?.trash === true && (
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

export default MainPage;
