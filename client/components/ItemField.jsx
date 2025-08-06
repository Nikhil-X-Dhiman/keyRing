import React, { useState } from "react";
import { BiSolidCopy } from "react-icons/bi";
import { FiMinusCircle } from "react-icons/fi";
import { MdOutlineLaunch } from "react-icons/md";
import { PiEyeDuotone, PiEyeSlash } from "react-icons/pi";
import { PiPasswordDuotone } from "react-icons/pi";
import { TbRefreshDot } from "react-icons/tb";

export const ItemField = React.forwardRef(
	(
		{
			label,
			type,
			name,
			id,
			value,
			onChange,
			onClick,
			readOnly,
			autoComplete = "off",
			required = false,
			mode,
			showToggle = false,
			showCopy = false,
			showDel = false,
			styles = "",
			onURICopyClick,
			showCopyLink,
			onLinkClick,
			showLinkOpen,
			onLinkDel,
			showGeneratePassword,
			onOpenPasswordGenerate,
			showRefreshGeneratePassword,
			handleReRunGeneratePassword,
			defaultValue,
		},
		ref
	) => {
		const [visible, setVisible] = useState(false);
		const copyTitle = name?.charAt(0)?.toUpperCase() + name?.slice(1);
		return (
			<>
				{showDel === true && (
					<div className="pr-3.5">
						<FiMinusCircle
							title="Remove"
							className="text-2xl text-red-500 cursor-pointer"
							onClick={onLinkDel}
						/>
					</div>
				)}

				<div className="flex flex-col w-full">
					<label className="text-slate-300 text-sm" htmlFor="name">
						{label}
					</label>
					<input
						type={visible ? "text" : type}
						name={name}
						id={id}
						value={value}
						onChange={onChange}
						defaultValue={defaultValue}
						readOnly={readOnly}
						ref={ref}
						autoComplete={autoComplete}
						required={required}
						className={`${
							mode === "View" ? "focus:outline-none" : "outline-none"
						} cursor-default text-[1.2rem] ${styles}`}
					/>
				</div>

				<div className="flex gap-3">
					{visible && showToggle && (
						<PiEyeSlash
							className="text-2xl cursor-pointer opacity-70  duration-200"
							title="Toggle Visibility"
							onClick={() => setVisible((prev) => !prev)}
						/>
					)}
					{!visible && showToggle && (
						<PiEyeDuotone
							className="text-2xl cursor-pointer opacity-70 duration-200"
							title="Toggle Visibility"
							onClick={() => setVisible((prev) => !prev)}
						/>
					)}
					{showLinkOpen && (
						<MdOutlineLaunch
							className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
							title="Open Link"
							onClick={onLinkClick}
						/>
					)}

					{showGeneratePassword && (
						<PiPasswordDuotone
							className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
							title="Open Password Generate Modal"
							onClick={onOpenPasswordGenerate}
						/>
					)}
					{showRefreshGeneratePassword && (
						<TbRefreshDot
							className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
							title="Generate New Password"
							onClick={handleReRunGeneratePassword}
						/>
					)}

					{showCopyLink && (
						<BiSolidCopy
							className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
							title="Copy Link"
							onClick={onURICopyClick}
						/>
					)}

					{showCopy === true && (
						<BiSolidCopy
							className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
							title={`Copy ${copyTitle}`}
							onClick={onClick}
						/>
					)}
				</div>
			</>
		);
	}
);
