import { useNavigate } from "react-router";
import { instance, useData } from "../context/MainContext";
import { AuthBtn } from "../UI/AuthBtn";
import { LoginEForm } from "../UI/LoginEForm";

export function LoginEmail() {
	const { loading, email, setLoading } = useData();
	const navigate = useNavigate();

	function handleEmailCheck() {
		setLoading(true);
		console.log(email);

		instance
			.post(
				"/auth/email",
				{
					email: email,
				},
				{ withCredentials: true }
			)
			.then((res) => console.log("email check req success", res))
			.catch((err) => console.log("error check req success", err));
		setLoading(false);
		navigate("/login/pass");
	}

	if (loading) {
		console.log("loading triggered");

		return <h2>Loading Data...</h2>;
	}

	return (
		<>
			{/* {loading && <h2>Loading Data...</h2>} */}
			<img src="../../assets/vault.png" alt="Vault_Image" />
			<h3>Login to KeyRing</h3>
			<div>
				<LoginEForm />
			</div>
			<AuthBtn text="Continue" handleBtnClick={handleEmailCheck} />
			<span>New to KeyRing?</span>
		</>
	);
}
