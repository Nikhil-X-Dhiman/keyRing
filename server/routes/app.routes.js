import { Router } from "express";
import { addPasswdData, getPasswdData } from "../services/data.services.js";

const router = Router();

router.get( '/api/passwd', ( req, res ) => {
  // if ( !req.user ) {
  //   return res.send( 'Not Authenticated' );
  // }
  const result = getPasswdData();
  console.log( result );

  res.send( 'all data' );
} );

router.post( '/api/passwd', async ( req, res ) => {
  // if ( !req.user ) {
  //   return res.send( 'Not Authenticated' );
  // }
  console.log( req.body );

  const { serviceName, username, password, website, uri, userID } = req.body;
  const result = await addPasswdData( { serviceName, username, password, website, uri, userID } );
  console.log( result );
  return res.send( 'inserted' );
} );

export const appRoutes = router;