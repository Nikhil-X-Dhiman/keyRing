import CrossIcon from "../public/cross.svg?react";

export const InputError = ({ message, touched = false }) => {
	// const baseStyle = "";
	// const finalStyle = `${baseStyle} ${className}`;
	return (
		<>
			{message && touched ? (
				<div className="flex items-center gap-1 mb-1.5">
					<CrossIcon className="w-4 h-4 font-bold relative text-red-500 self-start" />
					<p className="flex items-center gap-1 text-[.7rem] font-semibold text-left text-red-500">
						{`Error: ${message}`}
					</p>
				</div>
			) : (
				""
			)}
		</>
	);
};

InputError.displayName = "InputError";
