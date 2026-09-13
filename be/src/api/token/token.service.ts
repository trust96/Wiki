import prisma from "../../helper/prisma";
import { AUTH_TOKEN_TYPE } from "../auth/auth.helper";

export const createToken = async (data: { userId: string; type: AUTH_TOKEN_TYPE }, expiresAt: string) => {
  const token = await prisma.token.create({
    data: {
      userId: data.userId,
      type: data.type,
      expiresAt,
    },
  });

  return token;
};

export const getTokenByCode = async (code: string) => {
  const token = await prisma.token.findUnique({
    where: {
      code,
      expiresAt: {
        lt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  return token;
};

export const getTokenByType = async (email: string, type: number) => {
  const token = await prisma.token.findFirst({
    where: {
      type,
      user: {
        email,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return token;
};
