import type { Response, Request } from "express";
import {
  changeUserPassword,
  createUserWithCredentials,
  deleteUser,
  getOtherUsers,
  getUserByEmail,
  getUserById,
  sendCredentialsEmail,
  updateUserProfile,
  verifyUserPassword,
} from "./user.service";
import logger from "../../helper/logger";
import { EApiCode } from "../../helper/constants";
import { getUserResponseMapper } from "./user.mapper";
import type { TChangePasswordInput, TCreateUserInput, TUserProfileInput } from "./user.model";

export const getUserController = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) {
    res.fail({ status: 404, code: EApiCode.UserNotFound });
    return;
  }

  const data = getUserResponseMapper(user);
  logger.info(`User retrieved with email: ${user.email}`);
  res.success({ status: 200, data });
};

export const getAllUsersController = async (req: Request, res: Response) => {
  const currentUserId = req.session.user?.id;
  const users = await getOtherUsers(currentUserId);
  const data = users.map(getUserResponseMapper);

  res.success({ status: 200, data });
};

export const createUserController = async (req: Request<Record<string, never>, unknown, TCreateUserInput>, res: Response) => {
  const existingUser = await getUserByEmail(req.body.email);
  if (existingUser) {
    logger.warn(`This Email (${req.body.email}) has already being used`);
    res.fail({ status: 409, code: EApiCode.EmailInUse });
    return;
  }

  const { user, temporaryPassword } = await createUserWithCredentials(req.body);
  await sendCredentialsEmail(user, temporaryPassword);
  res.success({
    status: 201,
    data: {
      ...getUserResponseMapper(user),
      temporaryPassword,
    },
  });
};

export const updateUserController = async (req: Request<{ id: string }, unknown, TUserProfileInput>, res: Response) => {
  const { id } = req.params;
  const user = await updateUserProfile(id, req.body);

  res.success({ status: 201, data: getUserResponseMapper(user) });
};

export const deleteUserController = async (req: Request<{ id: string }>, res: Response) => {
  const currentUserId = req.session.user?.id;
  await deleteUser(req.params.id);
  const users = await getOtherUsers(currentUserId);
  const data = users.map(getUserResponseMapper);

  res.success({ status: 200, data });
};

export const changePasswordController = async (req: Request<{ id: string }, unknown, TChangePasswordInput>, res: Response) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    res.fail({ status: 404, code: EApiCode.UserNotFound });
    return;
  }

  const passwordMatches = await verifyUserPassword(user, req.body.currentPassword);
  if (!passwordMatches) {
    res.fail({ status: 403, code: EApiCode.WrongCredentials });
    return;
  }

  await changeUserPassword(user.id, req.body.newPassword);
  res.success({ status: 200, data: null });
};
