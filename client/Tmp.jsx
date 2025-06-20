import { useEffect, useRef } from "react";

export const Tmp = () => {
	const one = "hello";
	const ref = useRef(null);
	const multiRef = useRef([]);
	const multi = ["a", "b", "config", "d", "e"];

	multiRef.current = [];

	useEffect(() => {
		console.log(ref.current);
		console.log(ref.current.textContent);
		console.log(multiRef.current);
	}, []);

	return (
		<>
			{console.log(one)}
			<h2 ref={(el) => (ref.current = el)}>Hello Page</h2>

			<ul>
				{multi.map((item, index) => (
					<li
						key={index}
						ref={(el) => {
							if (el && !multiRef.current.includes(el)) {
								multiRef.current.push(el);
							}
						}}
					>
						{item}
					</li>
				))}
			</ul>
		</>
	);
};
