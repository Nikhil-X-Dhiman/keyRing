import { MdOutlineAdd } from "react-icons/md";
import { Button } from "./Button";
import { memo, useMemo } from "react";

export const AddItemBtn = memo(
	({ pageMode, handleAddItem, handleEmptyTrash }) => {
		const MDOutlineAddContent = useMemo(() => {
			return <MdOutlineAdd className="text-blue-400 text-xl" size={32} />;
		}, []);
		return (
			<>
				{pageMode !== "Trash" ? (
					<Button title="Add Item" onClick={handleAddItem} variant="addItem">
						{MDOutlineAddContent}
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
	}
);

AddItemBtn.displayName = "AddItemButton";
