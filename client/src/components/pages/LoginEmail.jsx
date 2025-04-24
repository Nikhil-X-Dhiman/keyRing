import { AuthBtn } from "../UI/AuthBtn";
import { LoginEForm } from "../UI/LoginEForm";
import { Link } from "react-router";

export function LoginEmail() {
	return (
		<>
			<img src="../../assets/vault.png" alt="Vault_Image" />
			<h3>Login to KeyRing</h3>
			<div>
				<LoginEForm />
			</div>
			<AuthBtn text="Continue" />
			<span>New to KeyRing?</span>
		</>
	);
}
