export const Button = ({
	children,
	onClick,
	title,
	type,
	variant = "primary",
	disabled = false,
	className = "",
}) => {
	const variants = {
		primary:
			"font-medium py-2 px-4 w-full rounded-3xl shadow-md mt-2 transition-color duration-200 bg-blue-400 hover:bg-blue-300 text-slate-800 cursor-pointer",
		outline:
			"font-medium py-2 px-4 w-full rounded-3xl shadow-md mt-2 transition-color duration-200 border-2 border-blue-400 hover:bg-blue-400 text-blue-400 hover:text-slate-800 cursor-pointer",
		disabled:
			"font-medium py-2 px-4 w-full rounded-3xl shadow-md mt-2 transition-color duration-200 cursor-not-allowed bg-slate-600 hover:bg-slate-600 text-slate-800",
		danger:
			"bg-red-800 hover:bg-red-700 text-slate-200 font-medium py-2.5 px-4 rounded  cursor-pointer shadow-md border-1 border-slate-600 hover:border-slate-400 transition-all",
		addItem:
			"bg-slate-800 hover:bg-slate-900 active:bg-slate-950 flex justify-center font-medium py-2 w-full rounded shadow-2xl cursor-pointer  transition-colors",
		emptyTrash:
			"bg-slate-800 hover:bg-slate-900 active:bg-slate-950 flex justify-center font-medium py-3.5 w-full rounded shadow-2xl cursor-pointer  transition-colors text-sm",
	};

	const finalClass = `${className} ${variants[variant]}
	}`;

	return (
		<button
			title={title}
			type={type}
			className={finalClass}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

Button.displayName = "Button";
