import Modal from "./Modal";

const ConfirmEmptyModals = ({
	isOpen,
	onClose,
	title,
	button1Behaviour,
	button2Behaviour,
	button1,
	button2,
	children,
}) => {
	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title={title}
				button1Behaviour={button1Behaviour}
				button2Behaviour={button2Behaviour}
				button1={button1}
				button2={button2}
			>
				{children}
			</Modal>
		</>
	);
};

export default ConfirmEmptyModals;
