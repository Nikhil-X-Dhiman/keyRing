import { useState } from "react";

export const InputText = (
	{
		type,
		title,
		name,
		value,
		onchange,
		onclick,
		error = "",
		required = false,
		disabled = false,
		autofocus = false,
		showToggle = false,
		className = "",
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

	return <input />;
};
