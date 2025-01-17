import type z from "zod";
import type { registerSchema, loginSchema } from "./auth.schemas";
import type { walletSchema } from "./wallet.schemas";
import type { filtersSchema } from "./filters.schemas";
import type { passwordSchema, profileSchema } from "./profile.schemas";

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type WalletSchema = z.infer<typeof walletSchema>;
export type FiltersSchema = z.infer<typeof filtersSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
