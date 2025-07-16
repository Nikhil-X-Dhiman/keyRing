import { useState } from "react";
import { PiEyeDuotone, PiEyeSlash } from "react-icons/pi";
import { ImCancelCircle } from "react-icons/im";

export const InputField = (
	{
		label,
		type,
		title,
		name,
		id,
		value,
		placeholder,
		onChange,
		error = "",
		required = false,
		disabled = false,
		autoFocus = false,
		showToggle = false,
		className = "",
		onFocus,
		onBlur,
		...props
	},
	ref
) => {
	const [visible, setVisible] = useState(false);
	const showPasswdToggle = showToggle && type === "password";

	const handleToggleVisibility = (e) => {
		e.preventDefault();
		setVisible((prev) => !prev);
	};

	return (
		<fieldset
			className={`w-full px-2 pb-2 mb-3 rounded-md border-1 relative ${
				error && value ? "border-red-500" : "border-gray-400"
			} focus-within:border-blue-500 hover:border-blue-300
	focus-within:hover:border-blue-500 transition-all`}
		>
			<legend className="text-[.8rem] text-gray-400">
				{label} {required && <span>(required)</span>}
			</legend>
			<input
				type={showPasswdToggle && visible ? "text" : type}
				name={name}
				title={title}
				id={id}
				ref={ref}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
				disabled={disabled}
				required={required}
				autoFocus={autoFocus}
				className={`w-full font-base bg-transparent border-0 focus:outline-0 ${
					disabled ? "cursor-not-allowed text-gray-500" : ""
				} ${className}`}
				{...props}
			/>
			{showPasswdToggle && (
				<button
					onClick={handleToggleVisibility}
					className="absolute right-4 top-[2px] cursor-pointer"
				>
					{visible ? (
						<PiEyeSlash className="text-2xl cursor-pointer opacity-70  duration-200 w-5 h-5" />
					) : (
						<PiEyeDuotone className="text-2xl cursor-pointer opacity-70 duration-200 w-5 h-5" />
					)}
				</button>
			)}
			{error && (
				<div className="flex items-center gap-1 mt-1.5 text-red-500 text-[.75rem] font-semibold relative">
					<ImCancelCircle className="w-3 h-3 shrink-0 self-start" />
					<p className="relative bottom-0.5">{error}</p>
				</div>
			)}
		</fieldset>
	);
};

InputField.displayName = "InputField";
