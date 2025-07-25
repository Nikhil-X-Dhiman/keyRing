import e from "express";
import { authRouter } from "./auth.routes.js";
import { authenticateUserRequest } from "../middlewares/auth.middleware.js";
import { appRouter } from "./app.routes.js";

export const router = e.Router();

// public Auth Routes
router.use(authenticateUserRequest);

router.use("/api/v1/auth/", authRouter);

router.use("/api/v1/", appRouter);
