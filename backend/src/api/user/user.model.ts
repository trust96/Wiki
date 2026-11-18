import type { User } from "../../generated/prisma/client.js";

export type TUserResponseData = Pick<User, "id" | "email" | "surname" | "name" | "role" | "verifiedAt">;

export type TUserProfileInput = {
  email?: string;
  name?: string | null;
  surname?: string | null;
};

export type TCreateUserInput = TUserProfileInput & { email: string };

export type TChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type TCreateUserResult = { kind: "created"; user: User; temporaryPassword: string } | { kind: "emailInUse" };

export type TGetUserResult = { kind: "found"; user: User } | { kind: "userNotFound" };

export type TChangePasswordResult = { kind: "changed" } | { kind: "userNotFound" } | { kind: "wrongCredentials" };
