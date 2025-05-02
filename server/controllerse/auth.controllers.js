import {
  createUser,
  findLoginEmail,
  findLoginPassword,
  generateToken,
} from "../services/auth.service.js";
import {
  emailLoginSchema,
  passwdSchema,
  passwdValidator,
} from "../validators/auth.validators.js";
import argon2 from "argon2";

export function conCheck(req, res) {
  return res.send("Connection Success");
}

export async function findEmail(req, res) {
  if (req.user) {
    res.send("already logged in");
  }
  const { email } = req.body;
  const { error, data } = emailLoginSchema.safeParse(email);
  if (error) {
    console.error(error.errors[0].message);
    return res.send("Invalid Email");
  }
  const result = await findLoginEmail(email);

  console.log("check user email", result);

  if (!result) {
    return res.send("Email Not Registered");
  }

  // send json res after finding user exist in db
  res.send("Continue");
}

export async function postLogin(req, res) {
  if (req.user) {
    res.send("already logged in");
  }
  let { email, password } = req.body;
  let { error: emailError, data: emailData } =
    emailLoginSchema.safeParse(email);
  if (emailError) {
    console.log(emailError.errors[0].message);
    console.log("invalid email");
    return res.send("invalid email");
  }
  let passwdResult = passwdSchema.safeParse(password);
  let passwdError = passwdResult.error,
    passwdData = passwdResult.data;
  if (passwdError) {
    console.error(passwdError.errors[0].message);
    return res.send("Password Validation Failed");
  }

  let [result] = await findLoginPassword(email, password);
  console.log("Credential check:", result.password);
  let resultCheck = await argon2.verify(result.password, password);
  console.log(result);

  if (!resultCheck) {
    return res.send("Incorrect Password");
  }
  // create session here
  // const userClient = req.headers[ 'user-agent' ];
  // const ip = req.clientIp;
  // const userID = req.cookies;
  // // insert userid in req
  // createUserSession( userClient, ip, userID );
  const token = generateToken({
    id: result.id,
    name: result.name,
    email: result.email,
  });
  // here the cookie age expires in 15 min also but it takes it in mili-seconds(1000ms = 1s)
  res.cookie("access_token", token, { maxAge: 1000 * 60 * 15 });
  res.send("User Logged In");
}

export async function registerUser(req, res) {
  if (req.user) {
    res.send("already logged in");
  }
  let { email, name, password } = req.body;
  const findResult = await findLoginEmail(email);
  if (findResult) {
    return res.send("Already Registered");
  }
  password = await argon2.hash(password);
  console.log("hashed passwd", password);

  const createResult = createUser(email, name, password);
  res.cookie("access_token", "true", {
    maxAge: 1000 * 60 * 10,
    httpOnly: true,
    secure: true,
  });
  res.send("User Created");
}

export function logoutUser(req, res) {
  res.clearCookie("access_token");
  res.send("User Logout");
}
