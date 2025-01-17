import { z } from "zod";

export const filtersSchema = z.object({
  walletId: z.number(),
  wallet: z.object({
    user: z.object({
      id: z.number(),
    }),
  }),
  date: z
    .object({
      gte: z.date(),
    })
    .optional(),
});
