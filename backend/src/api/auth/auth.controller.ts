import { EApiCode } from "../../helper/constants";
import type { Response, Request } from "express";
import logger from "../../helper/logger";
import { getUserResponseMapper } from "../user/user.mapper";
import { authenticateUser, registerUser, triggerForgottenPassword } from "./auth.service";
import type { TAuthInput } from "./auth.model";

export const registerController = async (req: Request<Record<string, never>, unknown, TAuthInput>, res: Response) => {
  const result = await registerUser(req.body);
  if (result.kind === "emailInUse") {
    res.status(409).json({ code: EApiCode.EmailInUse });
    return;
  }

  res.status(201).json({
    data: null,
  });
};

export const loginController = async (req: Request<Record<string, never>, unknown, TAuthInput>, res: Response) => {
  const result = await authenticateUser(req.body);
  if (result.kind === "userNotFound") {
    res.status(403).json({ code: EApiCode.UserNotFound });
    return;
  }

  if (result.kind === "wrongCredentials") {
    res.status(403).json({ code: EApiCode.WrongCredentials });
    return;
  }

  if (result.kind === "accountNotVerified") {
    res.status(401).json({ code: EApiCode.AccountNotVerified });
    return;
  }

  const { user } = result;
  const payload = {
    id: user.id,
    role: user.role,
    status: user.status,
  };
  req.session.user = payload;

  logger.info("User logged in successfully");
  res.status(200).json({
    data: getUserResponseMapper(user),
  });
};

export const logoutController = (req: Request, res: Response) => {
  req.session.destroy(() => {});

  logger.info("User logged out successfully");
  res.status(200).json({ data: null });
};

export const triggerForgottenPasswordController = async (req: Request<Record<string, never>, unknown, Pick<TAuthInput, "email">>, res: Response) => {
  const result = await triggerForgottenPassword(req.body.email);
  if (result.kind === "userNotFound") {
    res.status(403).json({ code: EApiCode.UserNotFound });
    return;
  }

  res.status(200).json({
    data: null,
  });
};

export const changeForgottenPasswordController = async (_req: Request, res: Response) => {
  //TODO: add logic for change forgotten password
  logger.info("Password changed successfully");
  res.status(200).json({ data: null });
};

export const resendForgottenPasswordEmailController = async (_req: Request, res: Response) => {
  //TODO: add the implementation of the resend email
  logger.info("Forgotten password email sent successfully");
  res.status(200).json({
    data: null,
  });
};
