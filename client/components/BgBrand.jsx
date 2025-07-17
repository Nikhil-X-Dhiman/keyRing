import KeyRingIcon from "../public/keyring.svg?react";
export const BgBrand = () => {
	return (
		<div className="text-slate-400 flex gap-x-2 justify-center items-center h-full ">
			<KeyRingIcon className="w-17 h-17 relative bottom-[7%]" />
			<span className="font-thin text-5xl relative bottom-[7%]">
				<span className="font-bold">key</span>Ring
			</span>
		</div>
	);
};
