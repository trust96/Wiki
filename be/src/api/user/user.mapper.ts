import type { Prisma } from "../../generated/prisma/client.js";
import type { TPublicUser } from "@wiki/api-contracts";

export const getUserResponseMapper = (user: any): TPublicUser => {
  return {
    id: user?.id,
    email: user?.email,
    name: user?.name ?? null,
    role: user?.role,
    surname: user?.surname ?? null,
    verifiedAt: user?.verifiedAt ?? null,
  };
};

export const getUserRequestMapper = (user: {
  id?: string;
  surname?: string;
  name?: string;
  email?: string;
  role?: number | string | null;
  password?: string;
}): Prisma.UserCreateInput => {
  return {
    id: user.id,
    surname: user.surname,
    name: user.name,
    email: user.email,
    role: user.role ? Number(user.role) : null,
    password: user.password,
  };
};
