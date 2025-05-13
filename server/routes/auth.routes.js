import { Router } from "express";
import {
  conCheck,
  findEmail,
  logoutUser,
  postLogin,
  registerUser,
} from "../controllerse/auth.controllers.js";

const router = Router();

router.get("/", conCheck);
router.post("/", conCheck);

router.post("/auth/email", findEmail);

router.post("/auth/login", postLogin);

router.post("/auth/register", registerUser);

router.get("/logout", logoutUser);
router.post("/logout", logoutUser);

export const authRoutes = router; // const userClient = req.headers[ 'user-agent' ];
// const ip = req.clientIp;
// const userID = req.cookies;
// // insert userid in req
// createUserSession( userClient, ip, userID );
