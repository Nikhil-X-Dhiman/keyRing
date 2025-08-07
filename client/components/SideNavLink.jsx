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
			className={`py-2 md:py-0 flex items-center gap-x-1.5 hover:text-blue-500 ${
				pageMode === pageModeText ? "text-blue-400 font-medium" : ""
			} cursor-pointer`}
			onClick={() => setPageMode(pageModeText)}
		>
			{Icon && <Icon className="text-2xl xs:text-lg sm:text-2xl" />}
			<span className="hidden lg:inline">{label}</span>
		</li>
	);
};
