import { createBrowserRouter } from "react-router";
import App from "../App";
import { AppLayout } from "../components/layout/AppLayout";
import { Home } from "../components/pages/Home";
import { LoginEForm } from "../components/UI/LoginEForm";
import { LoginEmail } from "../components/pages/LoginEmail";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPass } from "../components/pages/LoginPass";
import { SignUp } from "../components/pages/SignUp";

export const router = createBrowserRouter( [
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        path: "/home",
        Component: AppLayout,
      },
    ]
  },
  {
    path: "/login/email",
    Component: LoginEmail,
  },
  {
    path: "/login/pass",
    Component: LoginPass,
  },
  {
    path: "/signup/email",
    Component: SignUp,
  }
] );