import { object, string } from "yup";

export const changePasswordValidation = object({
  body: object({
    currentPassword: string().required("Current password is mandatory"),
    newPassword: string().required("New password is mandatory"),
  }),
});
