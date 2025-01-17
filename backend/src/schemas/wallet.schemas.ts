import { z } from "zod";

export const walletSchema = z.object({
  address: z.string(),
  title: z.string(),
});
