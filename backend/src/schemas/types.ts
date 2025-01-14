import type { registerSchema } from "./auth.schemas";
import type z from "zod";

export type RegisterSchema = z.infer<typeof registerSchema>;
