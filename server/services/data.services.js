import { db } from "../drizzle/index.js";
import { passwdStorage } from "../drizzle/schema.js";

export const addPasswdData = async ({
  serviceName,
  username,
  password,
  website,
  uri,
  userID,
}) => {
  const result = await db
    .insert(passwdStorage)
    .values({ serviceName, username, password, website, uri, userID });
  console.log(result);
  return result;
};

export const getPasswdData = async () => {
  const result = await db.select().from(passwdStorage);
  console.log(result);
  return result;
};
