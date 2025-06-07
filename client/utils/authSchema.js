import { z } from "zod/v4";

export const emailSchema = z.email();

export const passwdSchema = z
	.string()
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*#@!$%&]).{8,24}$/);

export const nameSchema = z.coerce.string().min(2).max(32);
