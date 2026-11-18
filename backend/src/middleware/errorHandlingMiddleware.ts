import { ErrorRequestHandler } from "express";
import logger from "../helper/logger";
import { EApiCode } from "../helper/constants";

const errorHandlingMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err);
  res.fail({ status: 500, code: EApiCode.ServerError });
};

export default errorHandlingMiddleware;
