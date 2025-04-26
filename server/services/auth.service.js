import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/index.js";
import { session, users } from "../drizzle/schema.js";
import jwt from 'jsonwebtoken';

export const findLoginEmail = async ( email ) => {
  const [ result ] = await db
    .select( { id: users.id } )
    .from( users )
    .where( eq( users.email, email ) );

  return result;
};

export const findLoginPassword = async ( email, password ) => {
  // const [ result ] = await db
  //   .select()
  //   .from( users )
  //   .where( and( eq( users.email, email ), eq( users.password, password ) ) );

  // return result;
  // returns hashed password
  return await db
    .select().from( users ).where( eq( users.email, email ) );
};

export const createUser = async ( email, name, password ) => {
  return await db
    .insert( users ).values( { email, name, password } ).$returningId();
};

export const createUserSession = async ( userAgent, ip, userID ) => {
  return await db
    .insert( session ).values( { userAgent, ip, userID } );
};

export const generateToken = ( { id, name, email } ) => {
  // expires token in 15 min (takes value in seconds)
  return jwt.sign( { id, name, email }, process.env.JWT_SECRET, { expiresIn: 60 * 15 } );
};

export const verifyToken = ( token ) => {
  return jwt.verify( token, process.env.JWT_SECRET );
};