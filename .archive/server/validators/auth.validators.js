import z from "zod";

// export const emailValidator = ( email ) => {
//   const emailSchema = z.string().trim().email();
//   const { data, error } = emailSchema.safeParse( email );
//   if ( error ) {
//     console.log( "Email Validation Failed" );

//     console.error( error );
//     return false;
//   }
//   return data;
// };
export const emailLoginSchema = z.string().trim().email();

export const passwdSchema = z
  .string()
  .min(8, { message: "Password Must be at least 8 character long" });

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be more than 2 characters long" }),
  email: z.string().trim().email(),
});
