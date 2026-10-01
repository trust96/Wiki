import { NextFunction, Response, Request } from "express";
import logger from "../helper/logger";
import type { ZodType } from "zod";
import { EApiCode } from "@wiki/api-contracts";

const validate =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      logger.error(result.error.message);
      res.status(400).json({ code: EApiCode.ValidationError });
      return;
    }
    req.body = result.data;
    next();
  };

export default validate;
