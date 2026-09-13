import { Router } from "express";
import {
  changeForgottenPasswordController,
  loginController,
  logoutController,
  resendForgottenPasswordEmailController,
  triggerForgottenPasswordController,
} from "./auth.controller";
import auth from "../../middleware/protectedRoutes";
import { changeforgottenPasswordValidation, forgottenPasswordValidation, authValidation } from "./auth.helper";
import validate from "../../middleware/validationMiddleware";

export const authRouter = Router();

authRouter.post("/auth/login", validate(authValidation), loginController);
authRouter.post("/auth/forgotten_password", validate(forgottenPasswordValidation), triggerForgottenPasswordController);
authRouter.post("/auth/logout", auth(), logoutController);
authRouter.post("/auth/change_forgotten_password/:code", validate(changeforgottenPasswordValidation), changeForgottenPasswordController);
authRouter.post("/auth/resend/forgotten_password/:email/:language", resendForgottenPasswordEmailController);
