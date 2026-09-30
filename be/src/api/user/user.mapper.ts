import { Prisma } from "@prisma/client";
import { TUserResponseData } from "./user.model";

export const getUserResponseMapper = (user: any): TUserResponseData => {
  return {
    id: user?.id,
    email: user?.email,
    name: user?.name,
    role: user?.role,
    surname: user?.surname,
    verifiedAt: user?.verifiedAt,
  };
};

export const getUserRequestMapper = (user: TUserResponseData): Prisma.UserCreateInput => {
  return {
    id: user.id,
    surname: user.surname,
    name: user.name,
    email: user.email,
    role: user.role ? Number(user.role) : null,
    password: user.password,
  };
};
