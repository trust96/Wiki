import { NextFunction, Response, Request } from "express";
import logger from "../helper/logger";
import { ObjectSchema } from "yup";
import { EApiCode } from "../helper/constants";

const validate =
  <T extends { body?: unknown }>(schema: ObjectSchema<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = validated.body;
      next();
    } catch (error) {
      logger.error(error.message);
      res.fail({ status: 400, code: EApiCode.ValidationError });
    }
  };

export default validate;
