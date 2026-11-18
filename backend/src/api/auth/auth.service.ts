import { hash } from "bcryptjs";
import { PASSWORD_SALT } from "../../helper/constants";
import logger from "../../helper/logger";
import { createUser } from "../user/user.service";
import type { TAuthInput } from "./auth.model";

export const registerUser = async ({ email, password }: TAuthInput) => {
  const hashedPassword = await hash(password, PASSWORD_SALT);
  const user = await createUser({ email, password: hashedPassword });

  logger.info(`User created with email: ${user.email}`);
  return user;
};

export const sendForgottenPasswordEmail = async () => {
  try {
    //implement send email
    return;
  } catch (error) {
    logger.error(error);
  }
};
