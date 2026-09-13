import { render } from "@react-email/components";
import CredentialsEmail from "../../emails/auth/CredentialsEmail";
import { USER_ROLE } from "../../helper/constants";
import logger from "../../helper/logger";
import prisma from "../../helper/prisma";
import { sendEmail } from "../../helper/sendEmail";
import { User } from "@prisma/client";

export const createUser = async (data: any) => {
  const user = await prisma.user.create({
    data: {
      ...data,
    },
    include: {
      tokens: true,
      facility: true,
    },
  });
  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      facility: true,
    },
  });
  return user;
};

export const getUserByCode = async (code: string) => {
  const user = await prisma.user.findFirst({
    where: {
      tokens: {
        some: {
          code: {
            equals: code,
          },
        },
      },
    },
    include: {
      tokens: true,
      facility: true,
    },
  });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
    include: {
      tokens: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return user;
};

export const updateUser = async (id: string, data: Record<string, any>) => {
  const user = await prisma.user.update({
    where: { id },
    data,
    include: {
      facility: true,
    },
  });
  return user;
};

export const getAllUsers = async () => {
  const user = await prisma.user.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      facility: true,
    },
  });
  return user;
};

export const getAllUsersByType = async (userRole: USER_ROLE) => {
  const users = await prisma.user.findMany({
    where: {
      role: userRole,
    },
    include: {
      facility: true,
    },
  });
  return users;
};

export const sendCredentialsEmail = async (user: User) => {
  try {
    const email = await CredentialsEmail({ user });
    await sendEmail({
      subject: "Benvenuto su Gemma",
      to: user?.email,
      html: render(email),
    });
  } catch (error) {
    logger.error(error);
  }
};
