import { object, string } from "yup";

export enum AUTH_TOKEN_TYPE {
  SIGN_UP_VERIFICATION,
  SIGN_UP_VERIFICATION_EMAIL,
  FORGOTTEN_PASSWORD,
}

export const authValidation = object({
  body: object({
    email: string()
      .trim()
      .lowercase()
      .email("Email non valida")
      .required("Email richiesta"),
    password: string().required("Password richiesta"),
  }),
});

export const forgottenPasswordValidation = object({
  body: object({
    email: string()
      .trim()
      .lowercase()
      .email("Email non valida")
      .required("Email richiesta"),
  }),
});

export const changeforgottenPasswordValidation = object({
  body: object({
    password: string().required("Password richiesta"),
  }),
});
