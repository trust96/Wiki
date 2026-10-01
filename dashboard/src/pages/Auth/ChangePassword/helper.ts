import { z } from "zod";
import type { TChangePasswordRequest } from "@wiki/api-contracts";

export const changePasswordInitialValues = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};

/** UI form schema; confirmPassword is FE-only. */
export const changePasswordValidationSchema = z
  .object({
    oldPassword: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export const toChangePasswordRequest = (values: {
  oldPassword: string;
  password: string;
}): TChangePasswordRequest => ({
  currentPassword: values.oldPassword,
  newPassword: values.password,
});
