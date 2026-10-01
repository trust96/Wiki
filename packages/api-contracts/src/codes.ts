export const EApiCode = {
  Ok: null,
  WrongCredentials: 100,
  EmailInUse: 101,
  UserNotFound: 102,
  Unauthorized: 103,
  Forbidden: 104,
  ValidationError: 105,
  AccountNotVerified: 106,
  ServerError: 500,
} as const;

export type EApiCodeValue = (typeof EApiCode)[keyof typeof EApiCode];
export type EApiErrorCode = Exclude<EApiCodeValue, null>;
