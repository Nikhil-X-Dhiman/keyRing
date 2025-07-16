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
// export const InputError = ({ message, touched = false, className = "" }) => {
// 	const baseStyle =
// 		"flex items-center gap-1 text-[.7rem] font-semibold text-left text-red-500 mt-1 mb-1";
// 	const finalStyle = `${baseStyle} ${className}`;
// 	return (
// 		<>
// 			{message && touched ? (
// 				<p className={finalStyle}>
// 					<CrossIcon className="w-3 h-3 font-bold" />
// 					{`Error: ${message}`}
// 				</p>
// 			) : (
// 				""
// 			)}
// 		</>
// 	);
// };

InputError.displayName = "InputError";
