import { z } from "zod";

export const resetPasswordInitialValues = {
  password: "",
  confirmPassword: "",
};

export const resetPasswordValidationSchema = z.object({
  password: z.string().min(1, "Required"),
  confirmPassword: z.string().min(1, "Required"),
});
