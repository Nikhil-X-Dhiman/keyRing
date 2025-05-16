import { Link } from "react-router";
import { AuthBtn } from "../UI/AuthBtn";
import { useRef } from "react";
import { instance, useData } from "../context/MainContext";

export function LoginPass() {
	const passwordInputRef = useRef(null);
	const { setLoading, email } = useData();

	function handleLogin(password) {
		// logic to req user login try catch
		setLoading(true);
		console.log(`handle login: email: ${email}, password: ${password}`);

		instance
			.post("/auth/login", {
				email: email,
				password: password,
			})
			.then((res) => console.log("Login response: ", res))
			.catch((err) => console.error("Login error: ", err));
		setLoading(false);
	}

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
				<input
					type="password"
					name="password"
					id="password"
					ref={passwordInputRef}
					required
				/>
			</fieldset>
			<Link to="/signin/hint">Get password hint</Link>
			<AuthBtn
				text="Login with Password"
				handleBtnClick={handleLogin}
				passwordInputRef={passwordInputRef}
			/>
		</>
	);
}
