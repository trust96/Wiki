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

export const createUserRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().optional(),
  surname: z.string().optional(),
  role: z.number().optional(),
});

export const updateUserRequestSchema = createUserRequestSchema.partial();

export const changePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export type TCreateUserRequest = z.infer<typeof createUserRequestSchema>;
export type TUpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
export type TChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;
