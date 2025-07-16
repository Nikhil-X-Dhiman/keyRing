export const Button = ({
	children,
	onClick,
	title,
	variant = "primary",
	disabled = false,
	className = "",
}) => {
	const baseStyle =
		"font-medium py-2 px-4 w-full rounded-3xl shadow-md mt-2 transition-color duration-200";
	const variants = {
		primary: "bg-blue-400 hover:bg-blue-300 text-slate-800 cursor-pointer",
		outline:
			"border-2 border-blue-400 hover:bg-blue-400 text-blue-400 hover:text-slate-800 cursor-pointer",
		disabled:
			"cursor-not-allowed bg-slate-600 hover:bg-slate-600 text-slate-800",
	};

	const finalClass = `${className} ${variants[variant]}
	 ${baseStyle}} transition-colors`;

	return (
		<button
			title={title}
			className={finalClass}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

Button.displayName = "Button";
