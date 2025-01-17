import { passwordRegex } from "utils/regex";
import { z } from "zod";

export const profileSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export const passwordSchema = z.object({
  oldPassword: z.string().min(8).regex(passwordRegex, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
  newPassword: z.string().min(8).regex(passwordRegex, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
});
