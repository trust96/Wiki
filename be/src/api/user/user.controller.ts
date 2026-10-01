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

export const getUserController = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) {
    res.status(404).json({ message: "Utente non trovato" });
    return;
  }

  const data = getUserResponseMapper(user as any);
  logger.info(`User retrieved with email: ${user.email}`);
  res.status(200).json({ message: "Utente trovata con successo", data });
};

export const getAllUsersController = async (req: Request, res: Response) => {
  const currentUserId = req.session.user?.id;
  const users = await getAllUsers();
  const data = users.map(getUserResponseMapper)?.filter((user) => {
    return user?.id !== currentUserId;
  });

  res.status(200).json({ message: "retrieved all user", data });
};

export const createUserController = async (req: Request, res: Response) => {
  const { body } = req;

  const isEmailAlreadyUsed = await getUserByEmail(body.email);
  if (isEmailAlreadyUsed) {
    logger.warn(`This Email (${body.email}) has already being used`);
    res.status(409).json({ message: "Questo indirizzo email è già in uso" });
    return;
  }

  const temporaryPassword = getUuid(8);
  const hashedPassword = await hash(temporaryPassword, PASSWORD_SALT);
  const userInputData: Prisma.UserCreateInput = {
    ...getUserRequestMapper(body),
    password: hashedPassword,
  };
  const user = await createUser(userInputData);
  await sendCredentialsEmail(user, temporaryPassword);

  logger.info(`User created with email: ${user.email}`);
  res.status(201).json({
    message: "Azienda creata con successo",
    data: {
      ...getUserResponseMapper(user as any),
      temporaryPassword,
    },
  });
};

export const updateUserController = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const userData = getUserRequestMapper(req.body);
  const user = await updateUser(id, userData);

  logger.info(`Company updated with email: ${user.email}`);
  res.status(201).json({
    message: "Azienda cambiata con successo",
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

  res.status(200).json({ message: "user has been deleted successfully", data });
};

export const changePasswordController = async (req: Request<{ id: string }>, res: Response) => {
  const { newPassword, currentPassword } = req.body;
  const user = await getUserById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "Utente non trovato" });
    return;
  }

  const isCurrentPasswordCorrect = await compare(currentPassword, user.password);
  if (!isCurrentPasswordCorrect) {
    res.status(403).json({ message: "current password is not correct, please retry" });
    return;
  }

  const password = await hash(newPassword, PASSWORD_SALT);
  await updateUser(req.params.id, { password });

  res.status(200).json({ message: "password changed successfully" });
};
