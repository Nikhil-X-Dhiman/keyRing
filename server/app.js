import e from "express";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes.js";
import { appRoutes } from "./routes/app.routes.js";
import { verifyAuthentication } from "./middleware/auth.middleware.js";

const app = e();

const PORT = process.env.EXPRESS_PORT;

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
  }),
);

app.use(e.urlencoded({ extended: true }));

app.use(e.json());

app.use(requestIp.mw());

app.use(cookieParser());

app.use(verifyAuthentication);

app.use(authRoutes);

app.use(appRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});
