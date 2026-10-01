import {
  loginRequestSchema,
  registerRequestSchema,
  forgottenPasswordRequestSchema,
  changeForgottenPasswordRequestSchema,
} from "@wiki/api-contracts";

export const authValidation = loginRequestSchema;
export const registerValidation = registerRequestSchema;
export const forgottenPasswordValidation = forgottenPasswordRequestSchema;
export const changeforgottenPasswordValidation = changeForgottenPasswordRequestSchema;
