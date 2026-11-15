import { NextFunction, Response, Request } from "express";
import logger from "../helper/logger";
import { ObjectSchema } from "yup";

const validate =
  <T>(schema: ObjectSchema<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      logger.error(error.message);
      res.status(400).json({ message: error.message });
    }
  };

export default validate;
