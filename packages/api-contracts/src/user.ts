import { z } from "zod";

export const publicUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  surname: z.string().nullable(),
  role: z.number(),
  verifiedAt: z.union([z.string(), z.date()]).nullable().optional(),
});

export type TPublicUser = z.infer<typeof publicUserSchema>;
