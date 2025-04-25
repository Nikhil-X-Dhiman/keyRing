import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/index.js";
import { session, users } from "../drizzle/schema.js";

export const findLoginEmail = async ( email ) => {
  const [ result ] = await db
    .select( { id: users.id } )
    .from( users )
    .where( eq( users.email, email ) );

  return result;
};

export const verifyLoginCredential = async ( email, password ) => {
  const [ result ] = await db
    .select()
    .from( users )
    .where( and( eq( users.email, email ), eq( users.password, password ) ) );

  return result;
};

export const createUser = async ( email, name, password ) => {
  return await db
    .insert( users ).values( { email, name, password } );
};

export const createUserSession = async ( userAgent, ip, userID ) => {
  return await db
    .insert( session ).values( { userAgent, ip, userID } );
};