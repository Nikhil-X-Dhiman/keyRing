import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/index.js";
import { session, users } from "../drizzle/schema.js";
import jwt from "jsonwebtoken";

export const findLoginEmail = async (email) => {
  const [result] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  return result;
};

export const getSessionById = async (id) => {
  const [sessionData] = await db
    .select()
    .from(session)
    .where(eq(session.id, id));
  return sessionData;
};

export const getUserById = async (id) => {
  const [userData] = await db.select().from(users).where(eq(users.id, id));
  return userData;
};

export const findLoginPassword = async (email, password) => {
  return await db.select().from(users).where(eq(users.email, email));
};

export const createUser = async (email, name, password) => {
  const [userID] = await db
    .insert(users)
    .values({ email, name, password })
    .$returningId();
  return userID;
};

export const createUserSession = async ({ userAgent, ip, userID }) => {
  const [sessionId] = await db
    .insert(session)
    .values({ userAgent, ip, userID })
    .$returningId();
  return sessionId;
};

export const deleteSession = async (sessionId) => {
  return db.delete(session).where(eq(session.id, sessionId));
};

export const generateToken = ({ id, name, email }) => {
  // expires token in 15 min (takes value in seconds)
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: 60 * 15,
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
