import { z } from "zod/v4";

export const emailSchema = z.email();

export const passwdSchema = z
	.string()
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/);
