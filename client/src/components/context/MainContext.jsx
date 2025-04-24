import { createContext, useContext, useState } from "react";

const MainContext = createContext(undefined);

export const MainProvider = ({children})=>{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  // also handle token to save to cookies

  function handleLogin() {
    // logic to req user login try catch
  }

  // handle logout too

  return <MainContext.Provider value={{setEmail, setPassword, handleLogin}}>
    {children}
  </MainContext.Provider>
}

export const useData = () =>{
  const context = useContext(MainProvider);
  if (context===undefined) {
    throw new Error("useData inside Main Provider")
  }
  return context;
}