import { verifyToken } from "../services/auth.service.js";

export const verifyAuthentication = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    console.log("decodedToken: ", decodedToken);
  } catch (error) {
    console.error(error);
    req.user = null;
  }
  return next();
};
