import { compare, hash } from "bcryptjs";
import { PASSWORD_SALT, USER_ROLE } from "../../helper/constants";
import logger from "../../helper/logger";
import { createUser, getUserByEmail } from "../user/user.service";
import type { TAuthInput, TForgottenPasswordResult, TLoginResult, TRegisterResult } from "./auth.model";

export const registerUser = async ({ email, password }: TAuthInput): Promise<TRegisterResult> => {
  const isEmailAlreadyUsed = await getUserByEmail(email);
  if (isEmailAlreadyUsed) {
    logger.warn(`This Email (${email}) has already being used`);
    return { kind: "emailInUse" };
  }

  const hashedPassword = await hash(password, PASSWORD_SALT);
  const user = await createUser({ email, password: hashedPassword });

  logger.info(`User created with email: ${user.email}`);
  return { kind: "registered" };
};

export const authenticateUser = async ({ email, password }: TAuthInput): Promise<TLoginResult> => {
  const user = await getUserByEmail(email);
  if (!user) {
    logger.error("User not found");
    return { kind: "userNotFound" };
  }

  const isSamePassword = await compare(password, user.password);
  if (!isSamePassword) {
    logger.error("Wrong password");
    return { kind: "wrongCredentials" };
  }

  // TODO: implement account verification.
  const isVerified = true;
  const isAdmin = user.role <= USER_ROLE.ADMIN;
  if (!isAdmin && !isVerified) {
    logger.error("Account not verified");
    return { kind: "accountNotVerified" };
  }

  return { kind: "authenticated", user };
};

export const triggerForgottenPassword = async (email: string): Promise<TForgottenPasswordResult> => {
  const user = await getUserByEmail(email);
  if (!user) {
    return { kind: "userNotFound" };
  }

  logger.info("triggered forgotten password");
  return { kind: "triggered" };
};

export const sendForgottenPasswordEmail = async () => {
  try {
    //implement send email
    return;
  } catch (error) {
    logger.error(error);
  }
};
