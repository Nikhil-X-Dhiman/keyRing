import { useState } from "react";
import { emailSchema } from "../utils/authSchema";

export const Register = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [passwd, setPasswd] = useState("");

	const handleSubmitBtn = (e) => {
		setIsLoading(true);
		e.preventDefault();
		const email = emailSchema.safeParse(email);
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
