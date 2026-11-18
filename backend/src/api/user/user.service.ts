import { compare, hash } from "bcryptjs";
import { PASSWORD_SALT, USER_ROLE } from "../../helper/constants";
import logger from "../../helper/logger";
import prisma from "../../helper/prisma";
import { getUuid } from "../../helper/uuid";
import { getUserRequestMapper } from "./user.mapper";
import type { Prisma, User } from "../../generated/prisma/client.js";
import type { TCreateUserInput, TUserProfileInput } from "./user.model";

export const createUser = async (data: Prisma.UserCreateInput) => {
  const user = await prisma.user.create({
    data,
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

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
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

export const getOtherUsers = async (currentUserId?: string) => {
  const users = await getAllUsers();
  return users.filter((user) => user.id !== currentUserId);
};

export const createUserWithCredentials = async (body: TCreateUserInput) => {
  const temporaryPassword = getUuid(8);
  const hashedPassword = await hash(temporaryPassword, PASSWORD_SALT);
  const user = await createUser({
    ...getUserRequestMapper(body),
    email: body.email,
    password: hashedPassword,
  });
  logger.info(`User created with email: ${user.email}`);
  return { user, temporaryPassword };
};

export const updateUserProfile = async (id: string, body: TUserProfileInput) => {
  const user = await updateUser(id, getUserRequestMapper(body));
  logger.info(`Company updated with email: ${user.email}`);
  return user;
};

export const deleteUser = async (id: string) => {
  await updateUser(id, { deletedAt: new Date().toISOString() });
};

export const verifyUserPassword = async (user: Pick<User, "password">, password: string) => {
  return compare(password, user.password);
};

export const changeUserPassword = async (id: string, newPassword: string) => {
  const password = await hash(newPassword, PASSWORD_SALT);
  await updateUser(id, { password });
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
