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
	// Default empty object for new password items

	const calculatePasswordStrength = (password) => {
		if (!password) return "None";
		if (password.length < 6) return "Weak";
		if (password.length < 10) return "Medium";
		if (
			/[A-Z]/.test(password) &&
			/[a-z]/.test(password) &&
			/[0-9]/.test(password) &&
			/[^A-Za-z0-9]/.test(password)
		) {
			return "Strong";
		}
		return "Medium";
	};
	// Function to evaluate the strength of a password based on length and character types

	const [passwdList, setPasswdList] = useState([]); // List of all password items from server
	const [itemIndex, setItemIndex] = useState(null); // Index of selected item for view/edit/add
	const [focusItem, setFocusItem] = useState(defaultEmpty); // Current item being edited or added
	const [mode, setMode] = useState(null); // UI mode: null, View, Edit, or Add
	const [searchItem, setSearchItem] = useState(""); // Search term for filtering items
	const [pageMode, setPageMode] = useState("All"); // Filter mode: All, Fav, or Trash
	// State management for password items and UI modes
	const nameRef = useRef();
	const navigate = useNavigate();
	const { setAuth } = useAuth();
	const privateInstance = usePrivateInstance();

	useEffect(() => {
		if ((mode === "Add" || mode === "Edit") && nameRef.current) {
			nameRef.current.focus();
		}
	}, [mode]);
	// Auto-focus name input field when in Add or Edit mode

	useEffect(() => {
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
	}, []);
	// Fetch all password items from server on component mount

	const filteredList = passwdList.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
			item.user.toLowerCase().includes(searchItem.toLowerCase());

		const matchesMode =
			(pageMode === "All" && item.trash === false) ||
			(pageMode === "Fav" && item.favourite === true && item.trash === false) ||
			(pageMode === "Trash" && item.trash === true);

		return matchesSearch && matchesMode;
	});
	// Filter password list based on search term and page mode (All, Fav, Trash)

	const handleAddItem = () => {
		setMode((prev) => {
			if (prev === null || prev === "Edit" || prev === "View") {
				return "Add";
			} else {
				return null; // Click again to close the form
			}
		});
		setFocusItem(defaultEmpty); // Reset form to default empty values
	};
	// Toggle Add mode to display form for new password item

	const handleInputChange = (e) => {
		if (mode === "Edit" || mode === "Add") {
			const { name, value } = e.target;
			setFocusItem((prev) => ({ ...prev, [name]: value }));
		}
	};
	// Update form field values in Add or Edit mode

	const handleNewURI = () => {
		if (mode === "Edit" || mode === "Add") {
			setFocusItem((prev) => {
				const newURIs = [...prev.uri];
				newURIs.push("");
				return { ...prev, uri: newURIs };
			});
		}
	};
	// Add a new empty URI field in Add or Edit mode

	const handleFavourite = () => {
		if (mode === "Edit" || mode === "Add") {
			setFocusItem((prev) => ({ ...prev, favourite: !prev.favourite }));
		}
	};
	// Toggle favourite status in Add or Edit mode

	const handleEditItem = () => {
		setFocusItem(passwdList[itemIndex] || "");
		setMode((prev) => {
			if (prev === null || prev === "Add" || prev === "View") {
				return "Edit";
			} else {
				return null; // Close form if already in Edit mode
			}
		});
	};
	// Switch to Edit mode with selected item's data

	const handleDeleteItem = async () => {
		if (pageMode === "All" || pageMode === "Fav") {
			// Move item to trash
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
			// Permanently delete item from trash
			const itemID = passwdList[itemIndex].id;
			try {
				const response = await privateInstance.delete(`/api/v1/item/${itemID}`);
				if (response.status === 200 && response.data.success === true) {
					setPasswdList((prev) => {
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
		setMode(null); // Close form after deletion
	};
	// Delete or move item to trash based on current page mode

	const handleEmptyTrash = async () => {
		try {
			const response = await privateInstance.delete(`/api/v1/all/del`);
			if (response.status === 200 && response.data.success === true) {
				setPasswdList((prev) => {
					const updatedList = prev.filter((item) => !item.trash);
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
		setMode(null); // Close form after emptying trash
	};
	// Permanently delete all items in trash

	const handleRestore = async () => {
		const itemToRestore = passwdList[itemIndex];
		if (!itemToRestore) return;

		try {
			const response = await privateInstance.patch(
				`/api/v1/item/${itemToRestore.id}`,
				{ trash: false }
			);

			if (response.status === 200 && response.data.success) {
				setPasswdList((prev) =>
					prev.map((item) =>
						item.id === itemToRestore.id ? { ...item, trash: false } : item
					)
				);
				handleClose(); // Close details panel as item is no longer in trash view
			}
		} catch (error) {
			console.error(
				"Restore Item Failed: ",
				error,
				error?.response?.data.msg || "Unknown Error!!!"
			);
		}
	};
	// Restore item from trash to active list

	const handleCancel = () => {
		if (mode === "Edit") {
			setFocusItem(defaultEmpty);
			setMode("View");
		} else if (mode === "Add") {
			setFocusItem(defaultEmpty);
			setMode(null);
		}
	};
	// Cancel form input and revert to previous mode

	const handleClose = () => {
		setItemIndex(null);
		setFocusItem(defaultEmpty);
		setMode(null);
	};
	// Close the details panel and reset form

	const handleSaveItem = async () => {
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
					setMode("View"); // Switch to View mode after saving
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
						setMode("View"); // Switch to View mode for the new item
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
	// Save changes to an existing item or add a new item to the server

	const handleClickItem = (id) => {
		let i = passwdList.findIndex((item) => item.id === id);
		setItemIndex(i);
		setMode((prev) => {
			if (
				prev === null ||
				prev === "Add" ||
				prev === "Edit" ||
				(prev === "View" && itemIndex !== i)
			) {
				return "View"; // Open View mode for selected item
			} else {
				return null; // Close if clicking the same item again
			}
		});
	};
	// Display details of clicked item in View mode

	const handleLogout = async () => {
		const response = await privateInstance.get("/api/v1/auth/logout", {
			withCredentials: true,
		});
		if (response.status === 200) {
			localStorage.setItem("isLogged", JSON.stringify(false));
			navigate("/login/email");
			setAuth(null); // Clear authentication state
		}
	};
	// Handle user logout and redirect to login page

	return (
		<main className="grid grid-cols-[250px_min(400px,30%)_1fr] grid-rows-[auto_1fr] h-full bg-gray-900 text-white overflow-hidden">
			{/* Main layout grid: Sidebar | Item List | Details Panel */}
			<section className="col-start-2 col-end-4 row-start-1 row-end-2 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-b-lg shadow-sm">
				{/* Search bar and logout button section */}
				<div className="flex-1 max-w-md">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<span className="text-gray-400">🔍</span>
						</div>
						<input
							type="search"
							name="app-search"
							id="app-search"
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
							className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
						/>
					</div>
				</div>
				<button
					onClick={handleLogout}
					className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg border border-blue-600 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-sm"
				>
					Logout
				</button>
			</section>
			<section className="col-start-1 col-end-2 row-start-1 row-end-3 bg-gray-800 border-r border-gray-700 shadow-md">
				{/* Sidebar with navigation options */}
				<div className="p-4">
					<h2 className="text-xl font-semibold text-white mb-6 pl-2">
						KeyRing
					</h2>
					<nav>
						{/* Navigation buttons for filtering items */}
						<ul className="space-y-1">
							<li>
								<button
									onClick={() => setPageMode("All")}
									className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
										pageMode === "All"
											? "bg-blue-500 text-white"
											: "text-gray-300 hover:bg-gray-700 hover:text-white"
									}`}
								>
									<span className="text-lg">🗂️</span>
									<span className="text-sm font-medium">All Items</span>
								</button>
							</li>
							<li>
								<button
									onClick={() => setPageMode("Fav")}
									className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
										pageMode === "Fav"
											? "bg-blue-500 text-white"
											: "text-gray-300 hover:bg-gray-700 hover:text-white"
									}`}
								>
									<span className="text-lg">⭐</span>
									<span className="text-sm font-medium">Favorites</span>
								</button>
							</li>
							<li>
								<button
									onClick={() => setPageMode("Trash")}
									className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
										pageMode === "Trash"
											? "bg-blue-500 text-white"
											: "text-gray-300 hover:bg-gray-700 hover:text-white"
									}`}
								>
									<span className="text-lg">🗑️</span>
									<span className="text-sm font-medium">Trash</span>
								</button>
							</li>
						</ul>
					</nav>
				</div>
			</section>
			<section className="col-start-2 col-end-3 row-start-2 row-end-3 flex flex-col bg-slate-900 border-r border-gray-700 shadow-inner">
				{/* Middle column: List of password items */}
				<div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-slate-900">
					{/* Scrollable list of filtered password items */}
					{filteredList.length !== 0 ? (
						<div className="space-y-3">
							{filteredList.map((item) => (
								<div
									key={item.id}
									onClick={() => handleClickItem(item.id)}
									className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 shadow-sm ${
										itemIndex !== null && passwdList[itemIndex]?.id === item.id
											? "bg-blue-500 border-blue-600 text-white"
											: "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600"
									}`}
								>
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-white">
											{item.name.charAt(0).toUpperCase()}
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="font-medium text-base truncate">
												{item.name}
											</h3>
											<p className="text-sm text-gray-400 truncate">
												{item.user || "No username"}
											</p>
										</div>
										{item.favourite && (
											<span className="text-yellow-400 text-base">⭐</span>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center h-full text-center">
							<div className="text-6xl mb-4 opacity-50">
								{pageMode === "All" ? "🗂️" : pageMode === "Fav" ? "⭐" : "🗑️"}
							</div>
							<h2 className="text-lg font-medium text-slate-300 mb-2">
								No{" "}
								{pageMode === "All"
									? "items"
									: pageMode === "Fav"
									? "favourites"
									: "items in trash"}
							</h2>
							<p className="text-sm text-slate-500">
								{pageMode === "All"
									? "Add your first password to get started"
									: pageMode === "Fav"
									? "Mark items as favourite to see them here"
									: "Deleted items will appear here"}
							</p>
						</div>
					)}
				</div>
				{pageMode !== "Trash" && (
					<div className="p-4 border-t border-gray-700 bg-slate-900 shadow-sm">
						<button
							onClick={handleAddItem}
							className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md"
						>
							<span className="text-lg">+</span>
							<span>Add Item</span>
						</button>
					</div>
				)}
			</section>
			<section className="col-start-3 col-end-4 row-start-2 row-end-3 bg-slate-900 flex flex-col h-full min-w-0 overflow-hidden shadow-inner">
				{/* Right column: Details panel for viewing/editing items */}
				{mode === "View" || mode === "Edit" || mode === "Add" ? (
					<div className="flex flex-col h-full">
						{/* Header for details panel */}
						<div className="p-4 border-b border-gray-700 bg-slate-900">
							<h3 className="text-lg font-semibold text-white">
								{mode === "View"
									? "Item Information"
									: mode === "Edit"
									? "Edit Item"
									: "Add New Item"}
							</h3>
						</div>
						{/* Scrollable form content for item details */}
						<div className="flex-1 p-4 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-slate-900">
							{/* Basic Information */}
							<div className="space-y-5">
								<div className="space-y-2">
									<label
										htmlFor="name"
										className="block text-sm font-medium text-gray-400"
									>
										Name *
									</label>
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
										className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors duration-200 shadow-sm ${
											mode === "View"
												? "bg-gray-800 border-gray-700 text-gray-300"
												: "bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
										}`}
										placeholder="Enter item name"
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="user"
										className="block text-sm font-medium text-gray-400"
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
										className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors duration-200 shadow-sm ${
											mode === "View"
												? "bg-gray-800 border-gray-700 text-gray-300"
												: "bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
										}`}
										placeholder="Enter username"
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="passwd"
										className="block text-sm font-medium text-gray-400"
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
										className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors duration-200 shadow-sm ${
											mode === "View"
												? "bg-gray-800 border-gray-700 text-gray-300"
												: "bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
										}`}
										placeholder="Enter password"
									/>
									{(mode === "Add" || mode === "Edit") && (
										<div className="mt-2">
											<div className="flex justify-between text-xs text-gray-400 mb-1">
												<span>Password strength:</span>
												<span className="font-medium text-gray-300">
													{calculatePasswordStrength(focusItem.passwd)}
												</span>
											</div>
											<div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
												<div
													className={`h-full rounded-full ${(() => {
														const strength = calculatePasswordStrength(
															focusItem.passwd
														);
														return strength === "Weak"
															? "bg-red-500 w-1/4"
															: strength === "Medium"
															? "bg-yellow-500 w-2/4"
															: strength === "Strong"
															? "bg-green-500 w-3/4"
															: "bg-gray-500 w-0";
													})()}`}
												/>
											</div>
										</div>
									)}
								</div>
								{(mode === "Add" || mode === "Edit") && (
									<div className="space-y-3 mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-sm">
										{/* Password generator section for Add/Edit mode */}
										<h4 className="text-base font-medium text-gray-300">
											Generate Password
										</h4>
										<div className="grid grid-cols-1 gap-3">
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="includeNumbers"
													checked={focusItem.includeNumbers || false}
													onChange={() =>
														setFocusItem((prev) => ({
															...prev,
															includeNumbers: !prev.includeNumbers,
														}))
													}
													className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 focus:ring-1 shadow-sm"
												/>
												<label
													htmlFor="includeNumbers"
													className="text-sm font-medium text-gray-300"
												>
													Include Numbers
												</label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="includeSpecialChars"
													checked={focusItem.includeSpecialChars || false}
													onChange={() =>
														setFocusItem((prev) => ({
															...prev,
															includeSpecialChars: !prev.includeSpecialChars,
														}))
													}
													className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 focus:ring-1 shadow-sm"
												/>
												<label
													htmlFor="includeSpecialChars"
													className="text-sm font-medium text-gray-300"
												>
													Include Special Characters
												</label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="includeCapitalLetters"
													checked={focusItem.includeCapitalLetters || false}
													onChange={() =>
														setFocusItem((prev) => ({
															...prev,
															includeCapitalLetters:
																!prev.includeCapitalLetters,
														}))
													}
													className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 focus:ring-1 shadow-sm"
												/>
												<label
													htmlFor="includeCapitalLetters"
													className="text-sm font-medium text-gray-300"
												>
													Include Capital Letters
												</label>
											</div>
											<div className="space-y-2">
												<label
													htmlFor="passwordLength"
													className="block text-sm font-medium text-gray-400"
												>
													Password Length: {focusItem.passwordLength || 12}
												</label>
												<input
													type="range"
													id="passwordLength"
													min="8"
													max="24"
													value={focusItem.passwordLength || 12}
													onChange={(e) =>
														setFocusItem((prev) => ({
															...prev,
															passwordLength: parseInt(e.target.value),
														}))
													}
													className="w-full"
												/>
											</div>
											<div className="space-y-2">
												<label
													htmlFor="specialCharCount"
													className="block text-sm font-medium text-gray-400"
												>
													Special Character Count:{" "}
													{focusItem.specialCharCount || 2}{" "}
													{focusItem.includeSpecialChars ? "" : "(Disabled)"}
												</label>
												<input
													type="range"
													id="specialCharCount"
													min="1"
													max="5"
													value={focusItem.specialCharCount || 2}
													onChange={(e) =>
														setFocusItem((prev) => ({
															...prev,
															specialCharCount: parseInt(e.target.value),
														}))
													}
													disabled={!focusItem.includeSpecialChars}
													className="w-full"
												/>
											</div>
										</div>
										<button
											onClick={() => {
												const length = focusItem.passwordLength || 12;
												const includeNumbers =
													focusItem.includeNumbers || false;
												const includeSpecialChars =
													focusItem.includeSpecialChars || false;
												const includeCapitalLetters =
													focusItem.includeCapitalLetters || false;
												const specialCharCount = includeSpecialChars
													? focusItem.specialCharCount || 2
													: 0;

												let characters = "abcdefghijklmnopqrstuvwxyz";
												if (includeNumbers) characters += "0123456789";
												if (includeSpecialChars)
													characters += "!@#$%^&*()_+-=[]{}|;:,.<>?";
												if (includeCapitalLetters)
													characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

												let password = "";
												let specialsAdded = 0;

												// Ensure minimum special characters are included
												if (includeSpecialChars) {
													const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
													for (let i = 0; i < specialCharCount; i++) {
														const randomIndex = Math.floor(
															Math.random() * specialChars.length
														);
														password += specialChars[randomIndex];
														specialsAdded++;
													}
												}

												// Fill remaining length with random characters
												for (let i = specialsAdded; i < length; i++) {
													const randomIndex = Math.floor(
														Math.random() * characters.length
													);
													password += characters[randomIndex];
												}

												// Shuffle to randomize character positions
												password = password
													.split("")
													.sort(() => Math.random() - 0.5)
													.join("");

												setFocusItem((prev) => ({ ...prev, passwd: password }));
											}}
											className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 shadow-md mt-2"
										>
											Generate Password
										</button>
									</div>
								)}
							</div>

							<div className="space-y-5">
								<div className="flex items-center justify-between">
									<h4 className="text-base font-medium text-gray-300">URIs</h4>
									{(mode === "Add" || mode === "Edit") && (
										<button
											onClick={handleNewURI}
											className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600 transition-colors duration-200 shadow-sm"
										>
											+ Add URI
										</button>
									)}
								</div>

								{mode === "View" &&
									passwdList.length !== 0 &&
									itemIndex !== null &&
									passwdList[itemIndex].uri.map((item, i) => (
										<div key={`uri-${i}`} className="space-y-2">
											<label
												htmlFor={`uri-${i}`}
												className="block text-sm font-medium text-gray-400"
											>
												URI {i + 1}
											</label>
											<input
												type="text"
												name={`uri-${i}`}
												id={`uri-${i}`}
												value={item || ""}
												readOnly
												className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-800 border-gray-700 text-gray-300 shadow-sm"
											/>
										</div>
									))}

								{(mode === "Edit" || mode === "Add") &&
									focusItem.uri.length !== 0 &&
									focusItem.uri.map((item, i) => (
										<div key={`edit-uri-${i}`} className="space-y-2">
											<label
												htmlFor={`edit-uri-${i}`}
												className="block text-sm font-medium text-gray-400"
											>
												URI {i + 1}
											</label>
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
												className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
												placeholder="Enter URI"
											/>
										</div>
									))}
							</div>

							{((mode === "View" && passwdList[itemIndex]?.note) ||
								mode === "Edit" ||
								mode === "Add") && (
								<div className="space-y-2">
									<label
										htmlFor="item-notes"
										className="block text-sm font-medium text-gray-400"
									>
										Notes
									</label>
									<textarea
										name="item-notes"
										id="item-notes"
										rows={3}
										value={
											mode === "View"
												? passwdList[itemIndex]?.note || ""
												: focusItem.note || ""
										}
										onChange={(e) => {
											if (mode === "Edit" || mode === "Add") {
												setFocusItem((prev) => {
													return { ...prev, note: e.target.value };
												});
											}
										}}
										readOnly={mode === "View"}
										className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors duration-200 resize-none shadow-sm ${
											mode === "View"
												? "bg-gray-800 border-gray-700 text-gray-300"
												: "bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
										}`}
										placeholder="Add notes..."
									/>
								</div>
							)}

							{(mode === "Add" ||
								mode === "Edit" ||
								(mode === "View" && passwdList[itemIndex]?.favourite)) && (
								<div className="flex items-center space-x-2">
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
										disabled={mode === "View"}
										className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 focus:ring-1 shadow-sm"
									/>
									<label
										htmlFor="favourite"
										className="text-sm font-medium text-gray-300"
									>
										Mark as favorite
									</label>
								</div>
							)}
						</div>
						<div className="p-6 border-t border-gray-700 bg-slate-900 shadow-sm">
							{/* Action Buttons */}
							{mode === "View" && (
								<div className="flex flex-wrap gap-2">
									{pageMode !== "Trash" && (
										<button
											onClick={handleEditItem}
											className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
										>
											Edit
										</button>
									)}
									{pageMode === "Trash" && (
										<>
											<button
												onClick={handleRestore}
												className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
											>
												Restore
											</button>
											<button
												onClick={handleEmptyTrash}
												className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
											>
												Empty Trash
											</button>
										</>
									)}
									<button
										onClick={handleDeleteItem}
										className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
									>
										{pageMode === "Trash" ? "Delete Permanently" : "Delete"}
									</button>
									<button
										onClick={handleClose}
										className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
									>
										Close
									</button>
								</div>
							)}
							{mode === "Edit" && (
								<div className="flex flex-wrap gap-2">
									<button
										onClick={handleSaveItem}
										className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
									>
										Save
									</button>
									<button
										onClick={handleCancel}
										className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
									>
										Cancel
									</button>
									<button
										onClick={handleDeleteItem}
										className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
									>
										Delete
									</button>
								</div>
							)}
							{mode === "Add" && (
								<div className="flex flex-wrap gap-2">
									<button
										onClick={handleSaveItem}
										className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
									>
										Save
									</button>
									<button
										onClick={handleCancel}
										className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
									>
										Cancel
									</button>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center h-full text-center">
						<div className="text-gray-400">
							<div className="text-5xl mb-4 opacity-50">🔐</div>
							<p className="text-lg font-medium mb-2">
								Select an item to view details
							</p>
							<p className="text-sm">
								Choose an item from the list to see its information
							</p>
						</div>
					</div>
				)}
			</section>
		</main>
	);
};
