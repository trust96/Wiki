import logger from "../../helper/logger";
import { sendEmail } from "../../helper/sendEmail";
import { User } from "@prisma/client";
import { APP_NAME } from "../../helper/constants";

export const sendForgottenPasswordEmail = async (user: User, token: Token) => {
  try {
    await sendEmail({
      subject: `Reset your password on ${APP_NAME}`,
      to: user?.email,
      html: "email content",
    });
  } catch (error) {
    logger.error(error);
  }
};
