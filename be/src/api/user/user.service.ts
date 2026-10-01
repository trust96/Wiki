import { USER_ROLE } from "../../helper/constants";
import logger from "../../helper/logger";
import prisma from "../../helper/prisma";
import type { User } from "../../generated/prisma/client.js";

export const createUser = async (data: any) => {
  const user = await prisma.user.create({
    data: {
      ...data,
    },
  });
  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });
  return user;
};

export const updateUser = async (id: string, data: Record<string, any>) => {
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  return user;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
    },
  });
  return users;
};

export const getAllUsersByType = async (userRole: USER_ROLE) => {
  const users = await prisma.user.findMany({
    where: {
      role: userRole,
    },
  });
  return users;
};

export const sendCredentialsEmail = async (user: User, plainPassword: string) => {
  try {
    // TODO: send welcome email with temporary credentials
    logger.info(`Credentials ready for ${user.email} (password delivery not wired yet)`);
    void plainPassword;
  } catch (error) {
    logger.error(error);
  }
};
