import CrossIcon from "../public/cross.svg?react";

export const ErrorModal = ({
	title = "Error Message",
	message,
	onClose,
	isOpen,
}) => {
	return (
		<>
			<div
				className={`fixed  top-10 w-70 border-1 border-gray-400 rounded-2xl transition-all ${
					isOpen ? "right-10" : "right-[-50rem] pointer-events-none"
				}`}
			>
				<div className="flex justify-between bg-red-900 p-2 pr-3 rounded-t-2xl">
					<h2>{title}</h2>
					<button onClick={onClose} className="cursor-pointer">
						<CrossIcon className="w-4 h-4 font-bold" />
					</button>
				</div>
				<div className="flex flex-col p-2 gap-3 bg-slate-700 rounded-b-2xl">
					<p>{message}</p>
					<button
						onClick={onClose}
						className="border-1 rounded-2xl cursor-pointer hover:bg-red-900 border-red-400 text-red-400 hover:text-slate-100 hover:border-slate-200 transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</>
	);
};

ErrorModal.displayName = "ErrorModal";
