import React from "react";

export const Button = React.memo(
	React.forwardRef(
		(
			{
				children,
				onClick,
				title,
				type,
				Icon,
				IconStyle = "",
				variant = "primary",
				disabled = false,
				tabIndex = 0,
				className = "",
			},
			ref
		) => {
			const variants = {
				primary:
					"font-medium py-2 px-4 w-full rounded-3xl shadow-md mt-2 transition-color duration-200 bg-blue-400 hover:bg-blue-300 text-slate-800 cursor-pointer",
				modalPrimary:
					"font-medium py-2 px-4 w-full rounded-3xl shadow-md transition-color duration-200 bg-blue-400 hover:bg-blue-300 text-slate-800 cursor-pointer",
				outline:
					"font-medium py-2 px-4 w-full rounded-3xl shadow-md mt-2 transition-color duration-200 border-2 border-blue-400 hover:bg-blue-400 text-blue-400 hover:text-slate-800 cursor-pointer",
				disabled:
					"font-medium py-2 px-4 w-full rounded-3xl shadow-md mt-2 transition-color duration-200 cursor-not-allowed bg-slate-600 hover:bg-slate-600 text-slate-800",
				danger:
					"bg-red-800 hover:bg-red-700 text-slate-200 font-medium py-2.5 px-4 rounded-r  cursor-pointer shadow-md border-1 border-slate-600 hover:border-slate-400 transition-all",
				modalDanger:
					"bg-red-800 hover:bg-red-700 text-slate-200 font-medium py-2 px-4 rounded  cursor-pointer shadow-md border-1 border-slate-600 hover:border-slate-400 transition-all",
				addItem:
					"bg-slate-800 hover:bg-slate-900 active:bg-slate-950 flex justify-center font-medium py-2 w-full rounded shadow-2xl cursor-pointer  transition-colors",
				emptyTrash:
					"bg-slate-800 hover:bg-slate-900 active:bg-slate-950 flex justify-center font-medium py-3.5 w-full rounded shadow-2xl cursor-pointer  transition-colors text-sm",
				newURI:
					"flex items-center gap-1.5 hover:bg-slate-600 py-2 px-3.5 cursor-pointer",
				diffOps:
					"bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-200 font-medium py-3.5 px-5 rounded cursor-pointer shadow-2xl transition-all",
				dropDown:
					"bg-blue-400 hover:bg-blue-300 border border-slate-600 hover:border-slate-400 active:bg-blue-400 text-slate-800 font-medium cursor-pointer shadow-2xl px-3 rounded-l transition-all h-full",
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
					tabIndex={tabIndex}
					ref={ref}
				>
					{Icon && (
						<Icon
							className={` ${
								variant === "diffOps" ? "text-blue-400 text-xl" : "text-2xl"
							} ${IconStyle}`}
						/>
					)}
					{children}
				</button>
			);
		}
	)
);

Button.displayName = "Button";
