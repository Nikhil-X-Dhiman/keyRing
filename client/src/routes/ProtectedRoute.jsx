import { Navigate, Outlet } from "react-router";

export function ProtectedRoute(){
  console.log('Entered Protected Route');
  let auth = {'login': false};
  return (
    auth.login ? <Outlet /> : <Navigate to="/login" />
  )
}