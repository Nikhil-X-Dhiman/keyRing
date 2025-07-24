import React from "react";

export const AuthFormHeader = React.memo(({ imgSrc, imgAlt, title, Icon }) => {
	return (
		<figure className="flex flex-col items-center gap-y-2 p-2 select-none">
			{imgSrc && <img src={imgSrc} alt={imgAlt} className="w-23 h-23" />}
			{Icon && <Icon className="w-26 h-26 text-light-grey scale-x-[-1]" />}
			<figcaption className="text-xl font-semibold mb-2">{title}</figcaption>
		</figure>
	);
});
