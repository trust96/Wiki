import { Prisma } from "@prisma/client";
import { TUserResponseData } from "./user.model";

export const getUserResponseMapper = (user: any): TUserResponseData => {
  return {
    id: user?.id,
    email: user?.email,
    name: user?.name,
    role: user?.role,
    status: user?.status,
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
    status: user.status ? Number(user.status) : null,
    role: user.role ? Number(user.role) : null,
    phoneNumber: user.phoneNumber ? user.phoneNumber.toString() : null,
    password: user.password,
    permissions: user.permissions?.join(","),
    facility: user.facilityId ? { connect: { id: Number(user.facilityId) } } : undefined,
  };
};
