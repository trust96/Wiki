import type { Response, Request } from "express";
import { changeUserPassword, createUserWithCredentials, deleteUser, getOtherUsers, getUser, updateUserProfile } from "./user.service";
import logger from "../../helper/logger";
import { EApiCode } from "../../helper/constants";
import { getUserResponseMapper } from "./user.mapper";
import type { TChangePasswordInput, TCreateUserInput, TUserProfileInput } from "./user.model";

export const getUserController = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const result = await getUser(id);
  if (result.kind === "userNotFound") {
    res.status(404).json({ code: EApiCode.UserNotFound });
    return;
  }

  const { user } = result;
  const data = getUserResponseMapper(user);
  logger.info(`User retrieved with email: ${user.email}`);
  res.status(200).json({ data });
};

export const getAllUsersController = async (req: Request, res: Response) => {
  const currentUserId = req.session.user?.id;
  const users = await getOtherUsers(currentUserId);
  const data = users.map(getUserResponseMapper);

  res.status(200).json({ data });
};

export const createUserController = async (req: Request<Record<string, never>, unknown, TCreateUserInput>, res: Response) => {
  const result = await createUserWithCredentials(req.body);
  if (result.kind === "emailInUse") {
    res.status(409).json({ code: EApiCode.EmailInUse });
    return;
  }

  const { user, temporaryPassword } = result;
  res.status(201).json({
    data: {
      ...getUserResponseMapper(user),
      temporaryPassword,
    },
  });
};

export const updateUserController = async (req: Request<{ id: string }, unknown, TUserProfileInput>, res: Response) => {
  const { id } = req.params;
  const user = await updateUserProfile(id, req.body);

  res.status(201).json({
    data: getUserResponseMapper(user),
  });
};

export const deleteUserController = async (req: Request<{ id: string }>, res: Response) => {
  const currentUserId = req.session.user?.id;
  const users = await deleteUser(req.params.id, currentUserId);
  const data = users.map(getUserResponseMapper);

  res.status(200).json({ data });
};

export const changePasswordController = async (req: Request<{ id: string }, unknown, TChangePasswordInput>, res: Response) => {
  const result = await changeUserPassword(req.params.id, req.body);
  if (result.kind === "userNotFound") {
    res.status(404).json({ code: EApiCode.UserNotFound });
    return;
  }

  if (result.kind === "wrongCredentials") {
    res.status(403).json({ code: EApiCode.WrongCredentials });
    return;
  }

  res.status(200).json({ data: null });
};
