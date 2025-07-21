export const SideNavLink = ({
	pageMode,
	pageModeText,
	setPageMode,
	label,
	Icon,
}) => {
	return (
		<li
			tabIndex={0}
			className={`flex items-center gap-x-1.5 hover:text-blue-500 ${
				pageMode === pageModeText ? "text-blue-400 font-medium" : ""
			} cursor-pointer`}
			onClick={() => setPageMode(pageModeText)}
		>
			{Icon && <Icon className="text-lg" />}
			<span>{label}</span>
		</li>
	);
};
