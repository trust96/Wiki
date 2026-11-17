import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import { type AnyObjectSchema } from "yup";
import { AuthValidationError, emptyPayloadValidation, validateAuthPayload } from "../api/auth/auth.validation";
import { ApiError, apiFailure } from "../helper/api";
import logger from "../helper/logger";

export const noStore: RequestHandler = (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
};

export const requireJson: RequestHandler = (req, res, next) => {
  const hasBody = req.headers["transfer-encoding"] !== undefined || Number(req.headers["content-length"] ?? 0) > 0;
  if (hasBody && !req.is("application/json")) {
    apiFailure(res, "INVALID_REQUEST");
    return;
  }
  next();
};

export const parseApiJson = express.json({
  limit: "64kb",
  inflate: false,
  strict: false,
  verify: (_req, _res, buffer, encoding) => {
    if (encoding.toLowerCase() !== "utf-8") throw new ApiError("INVALID_REQUEST");
    // Reject malformed UTF-8 rather than silently replacing credential characters.
    new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  },
});

export const validateApiPayload = (schema: AnyObjectSchema): RequestHandler => async (req, _res, next) => {
  try {
    req.body = await validateAuthPayload(schema, req.body);
    if (Object.keys(req.query).length) throw new AuthValidationError({ _form: ["Query fields are not allowed."] });
    next();
  } catch (error) {
    next(error);
  }
};

export const requireEmptyPayload: RequestHandler = async (req, _res, next) => {
  try {
    if (req.method === "GET" && req.body !== undefined) throw new AuthValidationError({ _form: ["A request body is not allowed."] });
    await validateAuthPayload(emptyPayloadValidation, req.body === undefined ? {} : req.body);
    if (Object.keys(req.query).length) throw new AuthValidationError({ _form: ["Query fields are not allowed."] });
    next();
  } catch (error) {
    next(error);
  }
};

export const methodNotAllowed: RequestHandler = (_req, res) => {
  apiFailure(res, "INVALID_REQUEST");
};

export const apiNotFound: RequestHandler = (_req, res) => {
  apiFailure(res, "NOT_FOUND");
};

const requestErrorTypes = new Set([
  "entity.parse.failed", "entity.too.large", "entity.verify.failed", "encoding.unsupported",
  "charset.unsupported", "request.aborted", "request.size.invalid",
]);

export const apiErrorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  if (error instanceof AuthValidationError) {
    apiFailure(res, "VALIDATION_ERROR", error.errors);
    return;
  }
  if (error instanceof ApiError) {
    apiFailure(res, error.code);
    return;
  }
  if (requestErrorTypes.has(error?.type)) {
    apiFailure(res, "INVALID_REQUEST");
    return;
  }
  logger.error("API request failed unexpectedly.");
  apiFailure(res, "INTERNAL_ERROR");
};
