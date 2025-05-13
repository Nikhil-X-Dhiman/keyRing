import {
  createUser,
  createUserSession,
  deleteSession,
  findLoginEmail,
  findLoginPassword,
  generateRefreshToken,
  generateToken,
  verifyToken,
} from "../services/auth.service.js";
import {
  emailLoginSchema,
  passwdSchema,
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
  const result = await findLoginEmail(data);

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
    return res.send("invalid email");
  }
  let passwdResult = passwdSchema.safeParse(password);
  let passwdError = passwdResult.error,
    passwdData = passwdResult.data;
  if (passwdError) {
    console.error(passwdError.errors[0].message);
    return res.send(`Password Validation Failed: ${passwdError}`);
  }

  let [result] = await findLoginPassword(emailData, passwdData);
  if (!result?.password) {
    return res.send("Account Not Found!!!");
  }
  console.log("Credential check:", result?.password);
  let resultCheck = await argon2.verify(result.password, passwdData);
  console.log(result);

  if (!resultCheck) {
    return res.send("Incorrect Password");
  }
  // create session here
  const userAgent = req.headers["user-agent"];
  const ip = req.clientIp;
  const userID = result.id;
  // // insert userid in req
  console.log(`test 1`);
  console.log(userAgent, ip, userID);

  const sessionID = await createUserSession({ userAgent, ip, userID });
  console.log(`test 2`);
  console.log(sessionID);

  const accessToken = generateToken({
    id: result.id,
    name: result.name,
    email: result.email,
  });
  const newRefreshToken = generateRefreshToken(sessionID);
  res.cookie("access_token", accessToken, { maxAge: 1000 * 60 * 15 });
  res.cookie("refresh_token", newRefreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  // here the cookie age expires in 15 min also but it takes it in mili-seconds(1000ms = 1s)
  // res.cookie("access_token", token, { maxAge: 1000 * 60 * 15 });
  res.send("User Logged In");
}

export async function registerUser(req, res) {
  if (req.user) {
    return res.send("already logged in");
  }
  let { email, name, password } = req.body;
  let { error: emailError, data: emailData } =
    emailLoginSchema.safeParse(email);
  if (emailError) {
    console.log(emailError.errors[0].message);
    return res.send("invalid email");
  }
  const findResult = await findLoginEmail(emailData);
  if (findResult) {
    return res.send("Already Registered");
  }
  let passwdResult = passwdSchema.safeParse(password);
  let passwdError = passwdResult.error;
  password = passwdResult.data;
  if (passwdError) {
    console.error(passwdError.errors[0].message);
    return res.send(`Password Validation Failed: ${passwdError}`);
  }
  password = await argon2.hash(password);
  console.log("hashed passwd", password);

  const createResult = createUser(email, name, password);
  // res.cookie("access_token", "true", {
  //   maxAge: 1000 * 60 * 10,
  //   httpOnly: true,
  //   secure: true,
  // });
  return res.send("User Created");
}

export function logoutUser(req, res) {
  if (!req.user) return res.send("Already Logged Out!!!");
  const refreshToken = req.cookies.refresh_token;
  const sessionID = verifyToken(refreshToken);

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  deleteSession(sessionID.id.id);
  res.send("User Logout");
}
