import { users } from "../drizzle/schema.js";
import {
  generateRefreshToken,
  generateToken,
  getSessionById,
  getUserById,
  verifyToken,
} from "../services/auth.service.js";

export const verifyAuthentication = async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  if (!accessToken && !refreshToken) {
    req.user = null;
  }
  if (accessToken) {
    try {
      const decodedToken = verifyToken(accessToken);
      req.user = decodedToken;
      console.log("decodedToken: ", decodedToken);
    } catch (error) {
      console.error(error);
      req.user = null;
    }
    return next();
  }
  if (refreshToken) {
    console.log("inside refresh token 1");

    const decodedRefreshToken = verifyToken(refreshToken);
    console.log(decodedRefreshToken);

    const userSession = await getSessionById(decodedRefreshToken.id.id);
    console.log(userSession);
    console.log("inside refresh token 2");

    const user = await getUserById(userSession.userID);
    if (user) {
      req.user = { id: user.id, name: user.name, email: user.email };
    } else {
      req.user = null;
      console.log(`session error`);

      return next();
    }
    console.log("inside refresh token");

    const newAccessToken = generateToken(req.user);
    console.log("refresh token decoded", decodedRefreshToken);

    const newRefreshToken = generateRefreshToken(decodedRefreshToken.id);
    res.cookie("access_token", newAccessToken, { maxAge: 1000 * 60 * 15 });
    res.cookie("refresh_token", newRefreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
  console.log(`auth varification completes`);
  return next();
};
