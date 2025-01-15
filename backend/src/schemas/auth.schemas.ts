import { passwordRegex } from "utils/regex";
import z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(passwordRegex, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
  name: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const refreshTokenSchema = z.string();
