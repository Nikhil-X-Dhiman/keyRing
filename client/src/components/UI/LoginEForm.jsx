import { useData } from "../context/MainContext";
import { AuthBtn } from "./AuthBtn";

export function LoginEForm() {
	const { email, setEmail } = useData();
	return (
		<>
			<form action="/auth/email" method="post">
				<fieldset className="border-solid border rounded-md">
					<legend>
						Email Address <span className="text-sm font-light">(required)</span>
					</legend>
					<input
						type="email"
						name="email"
						id="login-email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="border rounded"
					/>
					<input type="checkbox" name="remember-email" id="remember-email" />
					<label htmlFor="remember-email">Remember Email</label>
					{/* <AuthBtn /> */}
				</fieldset>
			</form>
		</>
	);
}
