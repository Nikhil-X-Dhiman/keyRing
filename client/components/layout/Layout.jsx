import { Outlet } from "react-router";
import KeyRingIcon from "../../public/keyring.svg?react";

export const Layout = () => {
	return (
		// add header here
		<div className="flex flex-col dark:bg-gray-800 dark:text-light-grey min-w-screen min-h-screen">
			{/* Header */}
			<header className="flex items-center justify-center gap-x-1 text-light-grey p-2">
				<KeyRingIcon className="w-9 h-9" />
				<span className="font-thin text-2xl select-none pointer-none">
					<span className="font-bold text-2xl">key</span>Ring
				</span>
			</header>
			<div className="grow h-full">
				<Outlet />
			</div>
			{/* Footer */}
			<footer className="flex justify-center items-center p-2">
				<h1 className="select-none">
					Made By <span className="text-blue-300">Nikhil Dhiman</span>
				</h1>
			</footer>
		</div>
		// add footer here
	);
};
