import { Link } from "react-router";
import { AuthBtn } from "../UI/AuthBtn";
import { SignUpForm } from "../UI/SignUpForm";

export function SignUp() {
	return (
		<>
			<figure>
				<img src="../../assets/add-user.png" alt="add_user_pic" />
				<figcaption>Create Account</figcaption>
			</figure>
			<SignUpForm />
			<AuthBtn text="Continue" />
			<br />
			<span>Already have an Account?</span>
			<Link to="/login/email">Log in</Link>
		</>
	);
}
