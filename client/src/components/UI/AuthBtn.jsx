export function AuthBtn({ text, handleBtnClick, passwordInputRef }) {
	return (
		<button
			type="submit"
			onClick={() => handleBtnClick(passwordInputRef?.current?.value)}
		>
			{text}
		</button>
	);
}
