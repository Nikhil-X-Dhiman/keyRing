import e from "express";
import { router } from "./routes/index.routes.js";

const PORT = process.env.SERVER_PORT;

const server = e();

server.use(e.urlencoded({ extended: true }));

server.use(router);

server.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
