import { Router } from "express";
import {
  loginController, logoutController, registerController, resendController,
  resetController, resetRequestController, sessionController, verificationController,
} from "./auth.controller";
import { emailRequestValidation, loginValidation, passwordResetValidation, registrationValidation, verificationValidation } from "./auth.validation";
import { checkCsrf, checkOrigin, loadSession, requireAnonymous, requireSession } from "./auth.session";
import { methodNotAllowed, requireEmptyPayload, validateApiPayload } from "../../middleware/apiMiddleware";
import { apiConfig } from "../../helper/config";
import { ApiError } from "../../helper/api";

export const authRouter = Router();
const protection = [checkOrigin, loadSession];

authRouter.route("/auth/register")
  .post(...protection, requireAnonymous, (req, res, next) => {
    if (!apiConfig.termsVersion) return next(new ApiError("INTERNAL_ERROR"));
    return validateApiPayload(registrationValidation(apiConfig.termsVersion))(req, res, next);
  }, registerController)
  .all(methodNotAllowed);
authRouter.route("/auth/login").post(...protection, requireAnonymous, validateApiPayload(loginValidation), loginController).all(methodNotAllowed);
authRouter.route("/auth/session").head(methodNotAllowed).get(...protection, requireSession, requireEmptyPayload, sessionController).all(methodNotAllowed);
authRouter.route("/auth/logout").post(...protection, checkCsrf, requireEmptyPayload, logoutController).all(methodNotAllowed);
authRouter.route("/auth/email-verification").post(...protection, checkCsrf, validateApiPayload(verificationValidation), verificationController).all(methodNotAllowed);
authRouter.route("/auth/email-verification/resend").post(...protection, checkCsrf, validateApiPayload(emailRequestValidation), resendController).all(methodNotAllowed);
authRouter.route("/auth/password-reset-requests").post(...protection, checkCsrf, validateApiPayload(emailRequestValidation), resetRequestController).all(methodNotAllowed);
authRouter.route("/auth/password-resets").post(...protection, checkCsrf, validateApiPayload(passwordResetValidation), resetController).all(methodNotAllowed);
