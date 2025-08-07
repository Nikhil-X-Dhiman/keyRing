import React, { useMemo, useState } from "react";
import { BiSolidCopy } from "react-icons/bi";
import { FiMinusCircle } from "react-icons/fi";
import { MdOutlineLaunch } from "react-icons/md";
import { PiEyeDuotone, PiEyeSlash } from "react-icons/pi";
import { PiPasswordDuotone } from "react-icons/pi";
import { TbRefreshDot } from "react-icons/tb";

export const ItemField = React.memo(
	React.forwardRef(
		(
			{
				label,
				type,
				name,
				id,
				i,
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

			const PiEyeSlashContent = useMemo(() => {
				return (
					<PiEyeSlash
						className="text-2xl cursor-pointer opacity-70  duration-200"
						title="Toggle Visibility"
						onClick={() => setVisible((prev) => !prev)}
					/>
				);
			}, []);
			const PiEyeDuotoneContent = useMemo(() => {
				return (
					<PiEyeDuotone
						className="text-2xl cursor-pointer opacity-70 duration-200"
						title="Toggle Visibility"
						onClick={() => setVisible((prev) => !prev)}
					/>
				);
			}, []);
			const MdOutlineLaunchContent = useMemo(() => {
				return (
					<MdOutlineLaunch
						className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
						title="Open Link"
						onClick={() => onLinkClick(i)}
					/>
				);
			}, [i, onLinkClick]);
			const PiPasswordDuotoneContent = useMemo(() => {
				return (
					<PiPasswordDuotone
						className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
						title="Open Password Generate Modal"
						onClick={onOpenPasswordGenerate}
					/>
				);
			}, []);
			const TbRefreshDotContent = useMemo(() => {
				return (
					<TbRefreshDot
						className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
						title="Generate New Password"
						onClick={handleReRunGeneratePassword}
					/>
				);
			}, []);
			const BiSolidCopyContent = useMemo(() => {
				return (
					<BiSolidCopy
						className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
						title="Copy Link"
						onClick={() => onURICopyClick(i)}
					/>
				);
			}, [i, onURICopyClick]);
			const BiSolidCopyContent2 = useMemo(() => {
				return (
					<BiSolidCopy
						className="text-2xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
						title={`Copy ${copyTitle}`}
						onClick={onClick}
					/>
				);
			}, [copyTitle, onClick]);
			const FiMinusCircleContent = useMemo(() => {
				return (
					<FiMinusCircle
						title="Remove"
						className="text-2xl text-red-500 cursor-pointer"
						onClick={() => onLinkDel(i)}
					/>
				);
			}, [i]);
			return (
				<>
					{showDel === true && (
						<div className="pr-3.5">{FiMinusCircleContent}</div>
					)}

					<div className="flex min-w-0 flex-col w-full">
						<label className="text-slate-300 text-sm" htmlFor="name">
							{label}
						</label>
						<input
							type={visible ? "text" : type}
							name={name}
							id={id}
							value={value}
							onChange={(e) => onChange(e, i)}
							defaultValue={defaultValue}
							readOnly={readOnly}
							ref={ref}
							autoComplete={autoComplete}
							required={required}
							className={`${
								mode === "View"
									? "focus:outline-none cursor-default"
									: "outline-none cursor-text"
							} text-[1.2rem] ${styles} `}
						/>
					</div>

					<div className="flex gap-3 ">
						{visible && showToggle && PiEyeSlashContent}

						{!visible && showToggle && PiEyeDuotoneContent}

						{showLinkOpen && MdOutlineLaunchContent}

						{showGeneratePassword && PiPasswordDuotoneContent}

						{showRefreshGeneratePassword && TbRefreshDotContent}

						{showCopyLink && BiSolidCopyContent}

						{showCopy === true && BiSolidCopyContent2}
					</div>
				</>
			);
		}
	)
);
