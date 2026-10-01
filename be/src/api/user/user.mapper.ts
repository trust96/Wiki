import type { TCreateUserRequest, TPublicUser, TUpdateUserRequest } from "@wiki/api-contracts";
import { USER_ROLE } from "../../helper/constants";
import { User } from "../../generated/prisma/client";

export const getUserResponseMapper = (user: User): TPublicUser => {
  return {
    id: user?.id,
    email: user?.email,
    name: user?.name ?? null,
    role: user?.role,
    surname: user?.surname ?? null,
    verifiedAt: user?.verifiedAt ?? null,
  };
};

export const getUserRequestMapper = (user: TCreateUserRequest | TUpdateUserRequest) => {
  return {
    surname: user.surname,
    name: user.name,
    email: user.email,
    role: USER_ROLE.USER,
  };
};
