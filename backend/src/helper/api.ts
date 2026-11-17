import type { Response } from "express";

export const apiCodes = [
  "INVALID_REQUEST", "VALIDATION_ERROR", "UNAUTHENTICATED", "INVALID_CREDENTIALS", "EMAIL_NOT_VERIFIED",
  "ONBOARDING_REQUIRED", "FORBIDDEN", "CSRF_INVALID", "NOT_FOUND", "IDENTITY_UNAVAILABLE",
  "USERNAME_UNAVAILABLE", "ARTIST_NAME_UNAVAILABLE", "ONBOARDING_ALREADY_COMPLETED",
  "VERIFICATION_TOKEN_INVALID", "RESET_TOKEN_INVALID", "RATE_LIMITED", "INTERNAL_ERROR",
] as const;

export type ApiCode = typeof apiCodes[number];

export class ApiError extends Error {
  constructor(public readonly code: ApiCode) {
    super(code);
    this.name = "ApiError";
  }
}

const sendJson = (res: Response, status: number, body: unknown) => {
  // Avoid Express's conditional-response handling changing contract responses to 304.
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
  return res;
};

export const apiSuccess = (res: Response, data: unknown = null) =>
  sendJson(res, 200, { isSuccess: true, code: null, data });

export const apiFailure = (res: Response, code: ApiCode, errors?: Record<string, string[]>) =>
  sendJson(res, code === "INTERNAL_ERROR" ? 500 : 200, {
    isSuccess: false,
    code,
    data: null,
    ...(code === "VALIDATION_ERROR" && errors ? { errors } : {}),
  });
