import { Router } from "express";
import { createUser, createUserSession, findLoginEmail, verifyLoginCredential } from "../services/auth.service.js";

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
  res.send( 'ok' );
} );

router.post( '/auth/login', async ( req, res ) => {
  const { email, password } = req.body;
  const result = await verifyLoginCredential( email, password );
  console.log( 'Credential check:', result );
  if ( !result ) {
    return res.send( 'Incorrect Password' );
  }
  // create session here
  userClient = req.headers[ 'user-agent' ];
  ip = req.clientIp;
  // insert userid in req
  createUserSession( userClient, ip, userID );
  res.send( 'User Logged In' );
} );

router.post( '/auth/create', async ( req, res ) => {
  const { email, name, password } = req.body;
  const findResult = await findLoginEmail( email );
  if ( findResult ) {
    return res.send( 'Already Registered' );
  }
  const createResult = createUser( email, name, password );
  res.cookie( 'access_token', 'true', { maxAge: 60 * 10, httpOnly: true, secure: true } );
  res.send( 'User Created' );
} );

router.get( '/logout', ( req, res ) => {
  res.clearCookie( 'access_token' );
  res.send( 'User Logout' );
} );


export const authRoutes = router;