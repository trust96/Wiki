import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const registerRequestSchema = loginRequestSchema;

export const forgottenPasswordRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const changeForgottenPasswordRequestSchema = z.object({
  password: z.string().min(1),
});

export type TLoginRequest = z.infer<typeof loginRequestSchema>;
export type TRegisterRequest = z.infer<typeof registerRequestSchema>;
export type TForgottenPasswordRequest = z.infer<
  typeof forgottenPasswordRequestSchema
>;
export type TChangeForgottenPasswordRequest = z.infer<
  typeof changeForgottenPasswordRequestSchema
>;
