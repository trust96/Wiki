import { Router } from "express";
import {
  changeForgottenPasswordController,
  loginController,
  logoutController,
  registerController,
  resendForgottenPasswordEmailController,
  triggerForgottenPasswordController,
} from "./auth.controller";
import auth from "../../middleware/protectedRoutes";
import validate from "../../middleware/validationMiddleware";
import { registerRequestSchema, loginRequestSchema, forgottenPasswordRequestSchema, changeForgottenPasswordRequestSchema } from "@wiki/api-contracts";

export const authRouter = Router();

authRouter.post("/auth/register", validate(registerRequestSchema), registerController);
authRouter.post("/auth/login", validate(loginRequestSchema), loginController);
authRouter.post("/auth/forgotten_password", validate(forgottenPasswordRequestSchema), triggerForgottenPasswordController);
authRouter.post("/auth/logout", auth(), logoutController);
authRouter.post("/auth/change_forgotten_password/:code", validate(changeForgottenPasswordRequestSchema), changeForgottenPasswordController);
authRouter.post("/auth/resend/forgotten_password/:email/:language", resendForgottenPasswordEmailController);
