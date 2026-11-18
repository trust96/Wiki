import { EApiCode, USER_ROLE } from "../../helper/constants";
import type { Response, Request } from "express";
import logger from "../../helper/logger";
import { getUserResponseMapper } from "../user/user.mapper";
import { getUserByEmail, verifyUserPassword } from "../user/user.service";
import { registerUser } from "./auth.service";
import type { TAuthInput } from "./auth.model";

export const registerController = async (req: Request<Record<string, never>, unknown, TAuthInput>, res: Response) => {
  const existingUser = await getUserByEmail(req.body.email);
  if (existingUser) {
    logger.warn(`This Email (${req.body.email}) has already being used`);
    res.fail({ status: 409, code: EApiCode.EmailInUse });
    return;
  }

  await registerUser(req.body);
  res.success({ status: 201, data: null });
};

export const loginController = async (req: Request<Record<string, never>, unknown, TAuthInput>, res: Response) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    logger.error("User not found");
    res.fail({ status: 403, code: EApiCode.UserNotFound });
    return;
  }

  const passwordMatches = await verifyUserPassword(user, req.body.password);
  if (!passwordMatches) {
    logger.error("Wrong password");
    res.fail({ status: 403, code: EApiCode.WrongCredentials });
    return;
  }

  // TODO: implement account verification.
  const isVerified = true;
  const isAdmin = user.role <= USER_ROLE.ADMIN;
  if (!isAdmin && !isVerified) {
    logger.error("Account not verified");
    res.fail({ status: 401, code: EApiCode.AccountNotVerified });
    return;
  }

  const payload = {
    id: user.id,
    role: user.role,
    status: user.status,
  };
  req.session.user = payload;

  logger.info("User logged in successfully");
  res.success({ status: 200, data: getUserResponseMapper(user) });
};

export const logoutController = (req: Request, res: Response) => {
  req.session.destroy(() => {});

  logger.info("User logged out successfully");
  res.success({ status: 200, data: null });
};

export const triggerForgottenPasswordController = async (req: Request<Record<string, never>, unknown, Pick<TAuthInput, "email">>, res: Response) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    res.fail({ status: 403, code: EApiCode.UserNotFound });
    return;
  }

  logger.info("triggered forgotten password");
  res.success({ status: 200, data: null });
};

export const changeForgottenPasswordController = async (_req: Request, res: Response) => {
  //TODO: add logic for change forgotten password
  logger.info("Password changed successfully");
  res.success({ status: 200, data: null });
};

export const resendForgottenPasswordEmailController = async (_req: Request, res: Response) => {
  //TODO: add the implementation of the resend email
  logger.info("Forgotten password email sent successfully");
  res.success({ status: 200, data: null });
};
