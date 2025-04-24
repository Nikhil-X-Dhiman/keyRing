import { Header } from "./Header";
import { Footer } from "./Footer"
import { Outlet } from "react-router";

export function AppLayout(){
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}