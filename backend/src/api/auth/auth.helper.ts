import { object, string } from "yup";

export const authValidation = object({
  body: object({
    email: string().trim().lowercase().email("Email not valid").required("Email is mandatory"),
    password: string().required("Password is mandatory"),
  }),
});

export const forgottenPasswordValidation = object({
  body: object({
    email: string().trim().lowercase().email("Email is not valid").required("Email is mandatory"),
  }),
});

export const changeforgottenPasswordValidation = object({
  body: object({
    password: string().required("Password is mandatory"),
  }),
});
