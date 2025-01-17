import { z } from "zod";

export const profileSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});
