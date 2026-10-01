import { Response, Request } from "express";
import {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  sendCredentialsEmail,
  updateUser,
} from "./user.service";
import { hash, compare } from "bcryptjs";
import logger from "../../helper/logger";
import { PASSWORD_SALT } from "../../helper/constants";
import { getUserResponseMapper, getUserRequestMapper } from "./user.mapper";
import { getUuid } from "../../helper/uuid";
import type { Prisma } from "../../generated/prisma/client.js";
import {
  EApiCode,
  type TChangePasswordRequest,
  type TCreateUserRequest,
  type TUpdateUserRequest,
} from "@wiki/api-contracts";

export const getUserController = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) {
    res.status(404).json({ code: EApiCode.UserNotFound });
    return;
  }

  const data = getUserResponseMapper(user as any);
  logger.info(`User retrieved with email: ${user.email}`);
  res.status(200).json({ data });
};

export const getAllUsersController = async (req: Request, res: Response) => {
  const currentUserId = req.session.user?.id;
  const users = await getAllUsers();
  const data = users.map(getUserResponseMapper)?.filter((user) => {
    return user?.id !== currentUserId;
  });

  res.status(200).json({ data });
};

export const createUserController = async (req: Request, res: Response) => {
  const body = req.body as TCreateUserRequest;

  const isEmailAlreadyUsed = await getUserByEmail(body.email);
  if (isEmailAlreadyUsed) {
    logger.warn(`This Email (${body.email}) has already being used`);
    res.status(409).json({ code: EApiCode.EmailInUse });
    return;
  }

  const temporaryPassword = getUuid(8);
  const hashedPassword = await hash(temporaryPassword, PASSWORD_SALT);
  const userInputData: Prisma.UserCreateInput = {
    ...getUserRequestMapper(body),
    email: body.email,
    password: hashedPassword,
  };
  const user = await createUser(userInputData);
  await sendCredentialsEmail(user, temporaryPassword);

  logger.info(`User created with email: ${user.email}`);
  res.status(201).json({
    data: {
      ...getUserResponseMapper(user as any),
      temporaryPassword,
    },
  });
};

export const updateUserController = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const body = req.body as TUpdateUserRequest;
  const userData = getUserRequestMapper(body);
  const user = await updateUser(id, userData);

  logger.info(`Company updated with email: ${user.email}`);
  res.status(201).json({
    data: getUserResponseMapper(user as any),
  });
};

export const deleteUserController = async (req: Request<{ id: string }>, res: Response) => {
  const currentUserId = req.session.user?.id;
  await updateUser(req.params.id, { deletedAt: new Date().toISOString() });
  const allUsers = await getAllUsers();
  const data = allUsers.map(getUserResponseMapper)?.filter((user) => {
    return user?.id !== currentUserId;
  });

  res.status(200).json({ data });
};

export const changePasswordController = async (req: Request<{ id: string }>, res: Response) => {
  const { newPassword, currentPassword } = req.body as TChangePasswordRequest;
  const user = await getUserById(req.params.id);
  if (!user) {
    res.status(404).json({ code: EApiCode.UserNotFound });
    return;
  }

  const isCurrentPasswordCorrect = await compare(currentPassword, user.password);
  if (!isCurrentPasswordCorrect) {
    res.status(403).json({ code: EApiCode.WrongCredentials });
    return;
  }

  const password = await hash(newPassword, PASSWORD_SALT);
  await updateUser(req.params.id, { password });

  res.status(200).json({ data: null });
};
