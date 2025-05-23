import e from "express";
import { authRouter } from "./auth.routes.js";

export const router = e.Router();

router.use("/api/v1/auth/", authRouter);
