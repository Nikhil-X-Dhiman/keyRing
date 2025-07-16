export const CheckboxField = ({
	label,
	id,
	title,
	checked,
	onChange,
	name,
	value,
	disabled = false,
	className = "",
	labelClass = "",
}) => {
	const baseLabelClass =
		"cursor-pointer select-none inline-flex items-center gap-1.5 self-start";
	const finalLabelClass = `${baseLabelClass} ${labelClass}`;
	const baseCheckboxClass =
		"w-4 h-4 accent-blue-400 hover:accent-blue-300 hover:cursor-pointer transition-all";
	const finalCheckboxClass = `${className} ${baseCheckboxClass}`;
	return (
		<label htmlFor={id} className={`${finalLabelClass}`}>
			<input
				type="checkbox"
				name={name}
				id={id}
				value={value}
				checked={checked}
				onChange={onChange}
				disabled={disabled}
				title={title}
				className={finalCheckboxClass}
			/>
			{<span className={finalLabelClass}>{`${label || ""}`}</span> || ""}
		</label>
	);
};
