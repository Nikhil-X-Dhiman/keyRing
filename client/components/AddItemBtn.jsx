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
				<Button
					title="Empty Trash"
					onClick={handleEmptyTrash}
					variant="emptyTrash"
				>
					Empty Trash
				</Button>
			)}
		</>
	);
};
