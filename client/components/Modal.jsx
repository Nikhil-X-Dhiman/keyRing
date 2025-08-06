import { useEffect, useMemo } from "react";
import { Button } from "./Button";
import CrossIcon from "../public/cross.svg?react";

const Modal = ({
	isOpen,
	onClose,
	button1Behaviour,
	button2Behaviour,
	title,
	button1 = "",
	button2 = "",
	children,
}) => {
	useEffect(() => {
		const handleEscapeKey = (event) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		if (isOpen) {
			document.addEventListener("keydown", handleEscapeKey);
		}
		return () => {
			document.removeEventListener("keydown", handleEscapeKey);
		};
	});

	const crossBtnContent = useMemo(() => {
		return <CrossIcon className="w-5 h-5 font-bold" />;
	}, []);
	if (!isOpen) {
		return null;
	}

	return (
		<>
			{/* Blur Background */}
			<div
				className="fixed inset-0 z-40 bg-opacity-50 backdrop-blur-sm flex justify-center items-center rounded-2xl"
				onClick={onClose}
			>
				<div
					className="relative inset-0 z-50 flex flex-col gap-4 justify-center items-center bg-slate-900 rounded-2xl shadow-xl w-xl"
					onClick={(e) => e.stopPropagation()}
				>
					{/* header Start */}
					<divcondition className="flex justify-between bg-slate-800 w-full text-md px-4 py-4 rounded-t-2xl">
						<h2 className="font-bold">{title}</h2>
						<button onClick={onClose} className="cursor-pointer">
							{crossBtnContent}
						</button>
					</divcondition>
					{/* header End */}
					{/* children Start */}
					<div className="px-4">{children}</div>
					{/* children Ends */}
					{/* Footer Starts */}
					<div className="flex justify-end items-center gap-5 bg-slate-800 w-full text-md px-4 py-3 rounded-b-2xl">
						{button1 && (
							<Button onClick={button1Behaviour} variant="modalPrimary">
								{button1}
							</Button>
						)}
						{button2 && (
							<Button onClick={button2Behaviour} variant="modalDanger">
								{button2}
							</Button>
						)}
					</div>
					{/* Footer Starts */}
				</div>
			</div>
		</>
	);
};

export default Modal;
