import { ErrorRequestHandler } from "express";
import logger from "../helper/logger";

const errorHandlingMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ message: "Server error, please contact an administrator" });
};

export default errorHandlingMiddleware;
