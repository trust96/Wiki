import { z } from "zod";

export const changePasswordInitialValues = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export const changePasswordValidationSchema = z.object({
  oldPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(1, "Required"),
  confirmNewPassword: z.string().min(1, "Required"),
});
