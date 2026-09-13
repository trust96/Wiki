import { compare } from "bcryptjs";
import { getUserByEmail } from "../user/user.service";
import { USER_STATUS, USER_ROLE } from "../../helper/constants";
import { Response, Request } from "express";
import logger from "../../helper/logger";
import { getUserResponseMapper } from "../user/user.mapper";

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    logger.error("User not found");
    res.status(403).json({ message: "Questo utente non esiste" });

    return;
  }

  const isSamePassword = await compare(password, user?.password);
  if (!isSamePassword) {
    logger.error("Wrong password");
    res.status(403).json({ message: "Password errata" });
    return;
  }

  //TODO: add ver
  const isVerified = true;
  const isAdmin = user.role <= USER_ROLE.SUPER_ADMIN;
  if (!isAdmin && !isVerified) {
    logger.error("Account not verified");
    res.status(401).json({ message: "Account non verificato" });

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
    message: "Accesso effettuato con successo",
  });
};

export const logoutController = (req: Request, res: Response) => {
  req.session.destroy(() => {});

  logger.info("User logged out successfully");
  res.status(200).json({ message: "Logout effettuato con successo" });
};

export const triggerForgottenPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    res.status(403).json({ message: "Questo utente non esiste" });
    return;
  }

  logger.info("triggered forgotten password");
  res.status(200).json({
    message: "Email per la password dimenticata mandato con successo",
  });
};

export const changeForgottenPasswordController = async (req: Request, res: Response) => {
  //TODO: add logic for change forgotten password
  logger.info("Password changed successfully");
  res.status(200).json({ message: "La password è stata cambiata con successo" });
};

export const resendForgottenPasswordEmailController = async (req: Request, res: Response) => {
  //TODO: add the implementation of the resend email
  logger.info("Forgotten password email sent successfully");
  res.status(200).json({
    message: "L'email della password dimenticata è stata rimandata con successo",
  });
};
