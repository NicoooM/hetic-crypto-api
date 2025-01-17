import type z from "zod";
import type { registerSchema, loginSchema } from "./auth.schemas";
import type { walletSchema } from "./wallet.schemas";

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type WalletSchema = z.infer<typeof walletSchema>;

export type Filters = {
  walletId: number;
  wallet: {
    user: {
      id: number;
    };
  };
  date?: {
    gte: Date;
  };
};
