import type { User } from "../../generated/prisma/client.js";

export type TAuthInput = {
  email: string;
  password: string;
};

export type TRegisterResult = { kind: "registered" } | { kind: "emailInUse" };

export type TLoginResult =
  | { kind: "authenticated"; user: User }
  | { kind: "userNotFound" }
  | { kind: "wrongCredentials" }
  | { kind: "accountNotVerified" };

export type TForgottenPasswordResult = { kind: "triggered" } | { kind: "userNotFound" };
