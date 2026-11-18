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
