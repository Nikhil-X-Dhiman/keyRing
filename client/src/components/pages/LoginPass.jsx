import { Link } from "react-router";
import { AuthBtn } from "../UI/AuthBtn";

export function LoginPass() {
	return (
		<>
			<figure>
				<img src="../../assets/wave.png" alt="hand_wave_img" />
				<figcaption>Welcome Back</figcaption>
			</figure>
			{/* read email address from context api */}
			<fieldset>
				<legend>
					Passwords<span>(required)</span>
				</legend>
				<input type="password" name="password" id="password" required />
			</fieldset>
			<Link to="/signin/hint">Get password hint</Link>
			<AuthBtn text="Login with Password" />
		</>
	);
}
