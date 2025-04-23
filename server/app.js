import e from "express"
import { authRoutes } from "./routes/auth.routes.js";

const app = e();

const PORT = process.env.EXPRESS_PORT;

app.use(e.urlencoded({extended: true}));

app.use(authRoutes);

app.listen(PORT, ()=>{
  console.log(`Server is listening at port: ${PORT}`);
})