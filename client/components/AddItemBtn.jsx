import { MdOutlineAdd } from "react-icons/md";
import { Button } from "./Button";

export const AddItemBtn = ({ pageMode, handleAddItem, handleEmptyTrash }) => {
	return (
		<>
			{pageMode !== "Trash" ? (
				<Button title="Add Item" onClick={handleAddItem} variant="addItem">
					<MdOutlineAdd className="text-blue-400 text-xl" size={32} />
				</Button>
			) : (
				// <button
				// 	className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 flex justify-center font-medium py-2 w-full rounded shadow-2xl cursor-pointer  transition-colors"
				// 	onClick={handleAddItem}
				// 	title="Add Item"
				// >
				// 	<MdOutlineAdd className="text-blue-400 text-xl" size={32} />
				// </button>
				<Button
					title="Empty Trash"
					onClick={handleEmptyTrash}
					variant="emptyTrash"
				>
					Empty Trash
				</Button>
				// <button
				// 	className="bg-slate-800 hover:bg-slate-900 active:bg-slate-950 flex justify-center font-medium py-3.5 w-full rounded shadow-2xl cursor-pointer  transition-colors text-sm"
				// 	onClick={handleEmptyTrash}
				// 	title="Add Item"
				// >
				// 	Empty Trash
				// </button>
			)}
		</>
	);
};
