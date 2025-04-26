import { Router } from "express";
import { createUser, createUserSession, findLoginEmail, findLoginPassword, generateToken } from "../services/auth.service.js";
import argon2 from "argon2";

const router = Router();

router.get( '/', ( req, res ) => {
  console.log( req.body );
  res.send( 'Success' );
} );

router.post( '/auth/email', async ( req, res ) => {
  const { email } = req.body;
  const result = await findLoginEmail( email );

  console.log( 'check user email', result );

  if ( !result ) {
    return res.send( 'Email Not Registered' );
  }

  // send json res after finding user exist in db
  res.send( 'Continue' );
} );

router.post( '/auth/login', async ( req, res ) => {
  let { email, password } = req.body;
  console.log( 'here' );

  let [ result ] = await findLoginPassword( email, password );
  console.log( 'Credential check:', result.password );
  let resultCheck = await argon2.verify( result.password, password );
  console.log( result );

  if ( !resultCheck ) {
    return res.send( 'Incorrect Password' );
  }
  // create session here
  // const userClient = req.headers[ 'user-agent' ];
  // const ip = req.clientIp;
  // const userID = req.cookies;
  // // insert userid in req
  // createUserSession( userClient, ip, userID );
  const token = generateToken( {
    id: result.id,
    name: result.name,
    email: result.email,
  } );
  // here the cookie age expires in 15 min also but it takes it in mili-seconds(1000ms = 1s)
  res.cookie( 'access_token', token, { maxAge: 1000 * 60 * 15 } );
  res.send( 'User Logged In' );
} );

router.post( '/auth/create', async ( req, res ) => {
  let { email, name, password } = req.body;
  const findResult = await findLoginEmail( email );
  if ( findResult ) {
    return res.send( 'Already Registered' );
  }
  password = await argon2.hash( password );
  console.log( 'hashed passwd', password );

  const createResult = createUser( email, name, password );
  res.cookie( 'access_token', 'true', { maxAge: 1000 * 60 * 10, httpOnly: true, secure: true } );
  res.send( 'User Created' );
} );

router.get( '/logout', ( req, res ) => {
  res.clearCookie( 'access_token' );
  res.send( 'User Logout' );
} );


export const authRoutes = router; // const userClient = req.headers[ 'user-agent' ];
// const ip = req.clientIp;
// const userID = req.cookies;
// // insert userid in req
// createUserSession( userClient, ip, userID );