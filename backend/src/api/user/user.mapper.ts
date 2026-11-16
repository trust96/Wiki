import { USER_ROLE } from "../../helper/constants";
import { User } from "../../generated/prisma/client";

export const getUserResponseMapper = (user: User): any => {
  return {
    id: user?.id,
    email: user?.email,
    name: user?.firstName ?? null,
    role: user?.role,
    surname: user?.lastName ?? null,
    verifiedAt: user?.emailVerifiedAt ?? null,
  };
};

export const getUserRequestMapper = (user: any) => {
  return {
    lastName: user.surname,
    firstName: user.name,
    email: user.email,
    role: USER_ROLE.USER,
  };
};
