import { useEffect, useRef, useState } from "react";
import { emailSchema } from "../utils/authSchema";

export const Register = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [validEmail, setValidEmail] = useState(false);
	const emailFocus = useRef();
	const [name, setName] = useState("");
	const [validName, setValidName] = useState("");
	const [passwd, setPasswd] = useState("");
	const [matchPasswd, setMatchPasswd] = useState("");
	const [validPasswd, setValidPasswd] = useState(false);
	const [validMatchPasswd, setValidMatchPasswd] = useState(false);

	const [err, setErr] = useState("");

	useEffect(() => {
		emailFocus.current.focus();
	}, []);

	useEffect(() => {
		if (email) {
			const { success, data, error } = emailSchema.safeParse(email);

			if (success) {
				setValidEmail(true);
				setErr(null);
			} else {
				setValidEmail(false);
				setErr(error.issues[0].message);
			}
		}
	}, [email]);

	const handleSubmitBtn = (e) => {
		setIsLoading(true);
		e.preventDefault();
		const email = emailSchema.safeParse(email);
		setIsLoading(false);
	};

	return isLoading ? (
		<h1>Loading!!!</h1>
	) : (
		<main>
			<figure>
				<img src="../public/add-user.png" alt="add-user-img" />
				<figcaption>Create account</figcaption>
			</figure>
			<form action="">
				<fieldset>
					<legend>
						Email address <span>(required)</span>
					</legend>
					<input
						type="email"
						id="register-email"
						ref={emailFocus}
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
					/>
				</fieldset>
				<fieldset>
					<legend>Name</legend>
					<input
						type="text"
						id="register-name"
						value={name}
						onChange={(e) => setName(e.currentTarget.value)}
					/>
				</fieldset>
				<fieldset>
					<legend>
						Password <span>(required)</span>
					</legend>
					<input
						type="password"
						id="register-passwd"
						value={passwd}
						onChange={(e) => setPasswd(e.currentTarget.value)}
					/>
				</fieldset>
				<button onSubmit={handleSubmitBtn}>Continue</button>
			</form>
		</main>
	);
};
