import { AuthBtn } from "./AuthBtn";

export function LoginEForm() {
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
						className="border rounded"
					/>
					<input type="checkbox" name="remember-email" id="remember-email" />
					<label htmlFor="remember-email">Remember Email</label>
					<AuthBtn />
				</fieldset>
			</form>
		</>
	);
}
