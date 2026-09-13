import nodemailer from "nodemailer";
import logger from "./logger";
import { GOOGLE_EMAIL, GOOGLE_PASSWORD } from "./constants";

type TEmailOptions = {
  subject: string;
  html: string;
  text?: string;
  to: string | Array<string>;
  from?: string;
};

export const sendEmail = async (opts: TEmailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: GOOGLE_EMAIL, // Your email address
        pass: GOOGLE_PASSWORD,
      },
    });
    const { html, subject, from, to, text } = opts;
    await transporter.verify();
    const info = await transporter.sendMail({
      from: from ?? `"Gemma" <${GOOGLE_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });
    return info;
  } catch (error) {
    logger.error(error);
  }
};
