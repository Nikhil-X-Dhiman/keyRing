import e from "express";
import { router } from "./routes/index.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./utils/handleCors.js";

const PORT = process.env.SERVER_PORT;

const server = e();

server.use(cors(corsOptions));

server.use(e.urlencoded({ extended: true }));
server.use(e.json());
server.use(cookieParser());

server.use(router);

server.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
