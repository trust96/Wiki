import { USER_ROLE } from "../../helper/constants";
import type { Prisma, User } from "../../generated/prisma/client.js";
import type { TUserProfileInput, TUserResponseData } from "./user.model";

export const getUserResponseMapper = (user: User): TUserResponseData => {
  return {
    id: user?.id,
    email: user?.email,
    name: user?.name ?? null,
    role: user?.role,
    surname: user?.surname ?? null,
    verifiedAt: user?.verifiedAt ?? null,
  };
};

export const getUserRequestMapper = (user: TUserProfileInput) => {
  return {
    surname: user.surname,
    name: user.name,
    email: user.email,
    role: USER_ROLE.USER,
  } satisfies Prisma.UserUpdateInput;
};
