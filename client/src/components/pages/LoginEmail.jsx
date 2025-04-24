import { LoginEForm } from "../UI/LoginEForm";

export function LoginEmail(){
  return(
    <>
      <img src="../../assets/vault.png" alt="Vault_Image" />
      <h3>Login to KeyRing</h3>
      <div>
        <LoginEForm />
      </div>
    </>
  )
}