import { EApiCode } from "@wiki/api-contracts";

export const errorMessages: Record<number, string> = {
  [EApiCode.WrongCredentials]: "wrong_credentials",
  [EApiCode.EmailInUse]: "email_in_use",
  [EApiCode.UserNotFound]: "user_not_found",
  [EApiCode.Unauthorized]: "unauthorized",
  [EApiCode.Forbidden]: "forbidden",
  [EApiCode.ValidationError]: "validation_error",
  [EApiCode.AccountNotVerified]: "account_not_verified",
  [EApiCode.ServerError]: "server_error",
};

export const genericErrorMessage = "generic_api_error";
