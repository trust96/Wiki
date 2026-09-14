import { z } from "zod";

export const loginInitialValues = {
  identifier: "",
  password: "",
} as const;

export const loginValidationSchema = z.object({
  identifier: z.string(),
  password: z.string().min(1, "Required"),
});
