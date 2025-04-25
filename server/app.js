import e from "express";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.routes.js";
import { appRoutes } from "./routes/app.routes.js";

const app = e();

const PORT = process.env.EXPRESS_PORT;

app.use( e.urlencoded( { extended: true } ) );

app.use( requestIp.mw() );

app.use( cookieParser() );

app.use( authRoutes );

app.use( appRoutes );

app.listen( PORT, () => {
  console.log( `Server is listening at port: ${PORT}` );
} );