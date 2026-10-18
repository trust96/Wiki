import { USER_ROLE } from "../../helper/constants";
import { User } from "../../generated/prisma/client";

export const getUserResponseMapper = (user: User): any => {
  return {
    id: user?.id,
    email: user?.email,
    name: user?.name ?? null,
    role: user?.role,
    surname: user?.surname ?? null,
    verifiedAt: user?.verifiedAt ?? null,
  };
};

export const getUserRequestMapper = (user: any) => {
  return {
    surname: user.surname,
    name: user.name,
    email: user.email,
    role: USER_ROLE.USER,
  };
};
