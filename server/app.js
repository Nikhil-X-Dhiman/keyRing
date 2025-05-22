import e from "express";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes.js";
import { appRoutes } from "./routes/app.routes.js";
import { verifyAuthentication } from "./middleware/auth.middleware.js";
import { reqLogging } from "./middleware/logEvents.js";
import { filterJsonReq } from "./middleware/filterTraffic.js";

const app = e();

const PORT = process.env.EXPRESS_PORT;

// app.use(reqLogging);

// app.use(filterJsonReq);

const whiteList = ["http://localhost:5173", "http://127.0.0.1:5173"];
const corsOptions = {
  origin: whiteList,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(e.urlencoded({ extended: true }));

app.use(e.json());

app.use(requestIp.mw());

app.use(cookieParser());

app.use(verifyAuthentication);

app.use(authRoutes);

app.use(appRoutes);

// app.all("*", (req, res) => {
//   if (req.accepts("text/html")) {
//     return res.status(404).sendFile("ERROR 404: Page Not Found");
//   }
//   if (req.accepts("application/json")) {
//     return res.status(404).send({ message: "Page Not Found" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});
