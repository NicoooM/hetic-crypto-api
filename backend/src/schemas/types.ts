import type { registerSchema, loginSchema } from "./auth.schemas";
import type z from "zod";

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
