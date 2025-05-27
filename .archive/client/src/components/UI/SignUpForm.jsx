import { AuthBtn } from "./AuthBtn";

export function SignUpForm() {
	return (
		<>
			<form action="/auth/signup/email" method="post">
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
				</fieldset>
				<fieldset className="border-solid border rounded-md">
					<legend>
						Name <span className="text-sm font-light">(required)</span>
					</legend>
					<input
						type="name"
						name="name"
						id="login-name"
						required
						className="border rounded"
					/>
				</fieldset>
				<input type="checkbox" name="advertise" id="advertise" />
				<label htmlFor="advertise">
					Get Announcements from KeyRing on your Inbox
				</label>
				<AuthBtn text="Continue" />
				<p>
					By continuing you agree to our Terms of Service and Privacy Policy
				</p>
			</form>
		</>
	);
}
