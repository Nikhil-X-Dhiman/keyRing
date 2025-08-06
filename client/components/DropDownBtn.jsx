import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./Button";

const DropDownBtn = memo(
	({ handleSync, handleLockVault, handleImport, handleExport, children }) => {
		const [open, setOpen] = useState(false);
		const dropDownDivRef = useRef(null);
		const dropDownBtnRef = useRef(null);
		const handleToggleDropDown = useCallback(() => {
			setOpen((prev) => !prev);
		}, []);

		useEffect(() => {
			const handleOutsideClick = (event) => {
				console.log("Event.target: ", event.target);
				console.log(open);

				console.log("dropDownBtnRef: ", dropDownBtnRef.current);

				if (
					dropDownDivRef.current &&
					!dropDownDivRef.current.contains(event.target) &&
					!dropDownBtnRef.current.contains(event.target)
				) {
					setOpen(false);
				}
			};
			if (open) {
				document.addEventListener("mousedown", handleOutsideClick);
			} else {
				document.removeEventListener("mousedown", handleOutsideClick);
			}
			return () => {
				document.removeEventListener("mousedown", handleOutsideClick);
			};
		}, [open]);
		return (
			<div className="">
				<Button
					ref={dropDownBtnRef}
					onClick={handleToggleDropDown}
					variant="dropDown"
				>
					{children}
				</Button>

				<div
					ref={dropDownDivRef}
					className={`absolute flex flex-col right-0 p-2 ${
						open
							? "z-10 bg-slate-700 text-slate-300 rounded-2xl shadow-lg w-56 ring-1 ring-slate-600"
							: "hidden"
					}`}
				>
					<Button onClick={handleSync}>Sync</Button>
					<Button onClick={handleLockVault}>Lock Vault</Button>
					<label
						htmlFor="fileImport"
						className="py-2 px-4 w-full rounded-3xl shadow-md mt-2 transiton-color duration-200 bg-blue-400 hover:bg-blue-300 text-slate-800 cursor-pointer text-center"
					>
						Import
					</label>
					<input
						type="file"
						id="fileImport"
						className="hidden"
						onChange={handleImport}
					/>
					<Button onClick={handleExport}>Export</Button>
				</div>
			</div>
		);
	}
);

export default DropDownBtn;
