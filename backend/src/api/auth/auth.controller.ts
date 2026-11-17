import type { Request, Response } from "express";
import { apiSuccess } from "../../helper/api";
import { authenticate, consumeToken, register, requestTokenMail, sessionUser } from "./auth.service";
import { createSession, destroySession, touchSession } from "./auth.session";

export const registerController = async (req: Request, res: Response) => {
  await register(req.body);
  apiSuccess(res);
};

export const loginController = async (req: Request, res: Response) => {
  const user = await authenticate(req.body.identifier, req.body.password);
  // Validate the projection before accepting any new session.
  sessionUser(user);
  const result = await createSession(req, res, user);
  apiSuccess(res, { user: sessionUser(result.user), csrfToken: result.csrfToken });
};

export const sessionController = async (req: Request, res: Response) => {
  sessionUser(req.auth!.user);
  const user = await touchSession(req, res);
  apiSuccess(res, { user: sessionUser(user), csrfToken: req.auth!.session.csrfToken });
};

export const logoutController = async (req: Request, res: Response) => {
  await destroySession(req, res);
  apiSuccess(res);
};

export const verificationController = async (req: Request, res: Response) => {
  await consumeToken(req.body.token, "EMAIL_VERIFICATION");
  apiSuccess(res);
};

export const resendController = async (req: Request, res: Response) => {
  await requestTokenMail(req.body.email, "EMAIL_VERIFICATION");
  apiSuccess(res);
};

export const resetRequestController = async (req: Request, res: Response) => {
  await requestTokenMail(req.body.email, "PASSWORD_RESET");
  apiSuccess(res);
};

export const resetController = async (req: Request, res: Response) => {
  await consumeToken(req.body.token, "PASSWORD_RESET", req.body.password);
  apiSuccess(res);
};
