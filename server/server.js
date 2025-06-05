import e from "express";
import { router } from "./routes/index.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const PORT = process.env.SERVER_PORT;

const server = e();

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const corsOptions = {
	origin: allowedOrigins,
	credentials: true,
};
server.use(cors(corsOptions));

server.use(e.urlencoded({ extended: true }));
server.use(e.json());
server.use(cookieParser());

server.use(router);

server.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
