import { compare, hash } from "bcryptjs";
import { PASSWORD_SALT, USER_ROLE } from "../../helper/constants";
import logger from "../../helper/logger";
import prisma from "../../helper/prisma";
import { getUuid } from "../../helper/uuid";
import { getUserRequestMapper } from "./user.mapper";
import type { Prisma, User } from "../../generated/prisma/client.js";
import type { TChangePasswordInput, TChangePasswordResult, TCreateUserInput, TCreateUserResult, TGetUserResult, TUserProfileInput } from "./user.model";

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

export const getUser = async (id: string): Promise<TGetUserResult> => {
  const user = await getUserById(id);
  if (!user) {
    return { kind: "userNotFound" };
  }
  return { kind: "found", user };
};

export const createUserWithCredentials = async (body: TCreateUserInput): Promise<TCreateUserResult> => {
  const isEmailAlreadyUsed = await getUserByEmail(body.email);
  if (isEmailAlreadyUsed) {
    logger.warn(`This Email (${body.email}) has already being used`);
    return { kind: "emailInUse" };
  }

  const temporaryPassword = getUuid(8);
  const hashedPassword = await hash(temporaryPassword, PASSWORD_SALT);
  const user = await createUser({
    ...getUserRequestMapper(body),
    email: body.email,
    password: hashedPassword,
  });
  await sendCredentialsEmail(user, temporaryPassword);

  logger.info(`User created with email: ${user.email}`);
  return { kind: "created", user, temporaryPassword };
};

export const updateUserProfile = async (id: string, body: TUserProfileInput) => {
  const user = await updateUser(id, getUserRequestMapper(body));
  logger.info(`Company updated with email: ${user.email}`);
  return user;
};

export const deleteUser = async (id: string, currentUserId?: string) => {
  await updateUser(id, { deletedAt: new Date().toISOString() });
  return getOtherUsers(currentUserId);
};

export const changeUserPassword = async (id: string, { currentPassword, newPassword }: TChangePasswordInput): Promise<TChangePasswordResult> => {
  const user = await getUserById(id);
  if (!user) {
    return { kind: "userNotFound" };
  }

  const isCurrentPasswordCorrect = await compare(currentPassword, user.password);
  if (!isCurrentPasswordCorrect) {
    return { kind: "wrongCredentials" };
  }

  const password = await hash(newPassword, PASSWORD_SALT);
  await updateUser(id, { password });
  return { kind: "changed" };
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
