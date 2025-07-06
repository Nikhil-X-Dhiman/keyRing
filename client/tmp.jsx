import { useRef } from "react";

const str = "abc";
for (const char of str) {
	console.log(char);
}

for (const key in str) {
	console.log(key);
}

export const Abc = () => {
	const abc = useRef(null);
	console.log("REF: ", abc.current);
	return null;
};
