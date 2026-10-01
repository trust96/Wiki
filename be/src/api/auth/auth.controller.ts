import { compare, hash } from "bcryptjs";
import { createUser, getUserByEmail } from "../user/user.service";
import { PASSWORD_SALT, USER_ROLE } from "../../helper/constants";
import { Response, Request } from "express";
import logger from "../../helper/logger";
import { getUserResponseMapper } from "../user/user.mapper";
import { EApiCode } from "@wiki/api-contracts";

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const isEmailAlreadyUsed = await getUserByEmail(email);
  if (isEmailAlreadyUsed) {
    logger.warn(`This Email (${email}) has already being used`);
    res.status(409).json({ code: EApiCode.EmailInUse });
    return;
  }

  const hashedPassword = await hash(password, PASSWORD_SALT);
  const user = await createUser({
    email,
    password: hashedPassword,
  });

  logger.info(`User created with email: ${user.email}`);
  res.status(201).json({
    data: null,
  });
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    logger.error("User not found");
    res.status(403).json({ code: EApiCode.UserNotFound });

    return;
  }

  const isSamePassword = await compare(password, user?.password);
  if (!isSamePassword) {
    logger.error("Wrong password");
    res.status(403).json({ code: EApiCode.WrongCredentials });
    return;
  }

  //TODO: add ver
  const isVerified = true;
  const isAdmin = user.role <= USER_ROLE.ADMIN;
  if (!isAdmin && !isVerified) {
    logger.error("Account not verified");
    res.status(401).json({ code: EApiCode.AccountNotVerified });

    return;
  }

  const payload = {
    id: user.id,
    role: user.role,
    status: user.status,
  };
  req.session.user = payload;

  logger.info("User logged in successfully");
  res.status(200).json({
    data: getUserResponseMapper(user as any),
  });
};

export const logoutController = (req: Request, res: Response) => {
  req.session.destroy(() => {});

  logger.info("User logged out successfully");
  res.status(200).json({ data: null });
};

export const triggerForgottenPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    res.status(403).json({ code: EApiCode.UserNotFound });
    return;
  }

  logger.info("triggered forgotten password");
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
